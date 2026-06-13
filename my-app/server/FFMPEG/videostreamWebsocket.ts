import { Buffer } from "node:buffer";
import { parse } from "node:url";
import WebSocket, { WebSocketServer } from "ws";
import { startFFmpegProcess } from "./videoProcessor.ts";
import { server } from "./videostreamServer.ts";
import { IncomingMessage } from "node:http";

declare module 'ws' {
    interface WebSocket {
        deviceId?: string;
        deviceType?: string;
    }
}

console.log("videostream module loaded");

const wss = new WebSocketServer({ server, path: "/video" });

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    console.log("Client connected:", req.url);

    if (!req.url) {
        ws.close();
        return;
    }

    const query = parse(req.url, true).query;
    const deviceId = Array.isArray(query.id) ? query.id[0] : query.id;
    const deviceType = Array.isArray(query.device) ? query.device[0] : query.device;

    ws.deviceId = deviceId;
    ws.deviceType = deviceType;

    console.log(typeof ws.deviceId, typeof ws.deviceType);

    let ffmpegProcess = startFFmpegProcess();
    let buffer = Buffer.alloc(0);

    ffmpegProcess.stdout.on("data", (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);

        while (true) {
            const start = buffer.indexOf(Buffer.from([0xff, 0xd8]));
            const end = buffer.indexOf(Buffer.from([0xff, 0xd9]), start);


            if (start !== -1 && end !== -1) {
                const frame = buffer.slice(start, end + 2);
                buffer = buffer.slice(end + 2);

                const isIosConnected = [...wss.clients].some(
                    (w) => w.deviceType === "ios" && w.deviceId === "user123"
                );

                if (ws.readyState === WebSocket.OPEN && isIosConnected) {

                    ws.send(frame, (err) => {
                        if (err) {
                            console.error("Send error:", err);
                        }
                    });
                }
            } else {
                break;
            }
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        if (ffmpegProcess) {
            ffmpegProcess.kill();
        }
    });

    ws.on("error", (err) => {
        console.error("WS Error:", err);
        if (ffmpegProcess) {
            ffmpegProcess.kill();
        }
    });
});
