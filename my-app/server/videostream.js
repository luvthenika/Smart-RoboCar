import { Buffer } from "node:buffer";
import { parse } from "node:url";
import WebSocket, { WebSocketServer } from "ws";
import { startFFmpegProcess } from "./videoProcessor.js";
import { server } from "./videostreamServer.js";

console.log("videostream module loaded");

const wss = new WebSocketServer({ server, path: "/video" });

wss.on("connection", (ws, req) => {
    console.log("Client connected:", req.url);

    const query = parse(req.url, true).query;
    ws.deviceId = query.id;
    ws.deviceType = query.device;

    console.log(typeof ws.deviceId, typeof ws.deviceType);
    console.log(`Клієнт підключився: ${ws.deviceType} з ID ${ws.deviceId}`);

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
                    // console.log("opened");
                    // console.log("Відправляємо кадр розміром:", frame.length);

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
