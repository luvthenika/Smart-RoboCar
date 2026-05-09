import express from "express";
import { Buffer } from "node:buffer";
import { createServer, request as httpRequest } from "node:http";
import { parse } from "node:url";
import WebSocket, { WebSocketServer } from "ws";
import { startFFmpegProcess } from "./FFMPEG/videoProcessor.ts";

const PORT = 8888;
const HOST = "192.168.3.5";

const app = express();
const server = createServer(app);

server.listen(PORT, HOST, () => {
    console.log(`HTTP/WS server listening on http://${HOST}:${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Combined WebSocket server is running.");
});

const videoWss = new WebSocketServer({ server, path: "/video" });
const commandWss = new WebSocketServer({ server, path: "/commands" });
const sensorWss = new WebSocketServer({ server, path: "/sensor-data" });

const PYTHON_SENSOR_HOST = "127.0.0.1";
const PYTHON_SENSOR_PORT = 5000;
const PYTHON_SENSOR_PATH = "/sensor";

let ffmpegProcess = null;
let videoBuffer = Buffer.alloc(0);

function stopVideoProcess() {
    if (ffmpegProcess) {
        ffmpegProcess.kill();
        ffmpegProcess = null;
        videoBuffer = Buffer.alloc(0);
    }
}

function broadcastVideoFrame(frame) {
    videoWss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(frame, (err) => {
                if (err) {
                    console.error("Video frame send error:", err);
                }
            });
        }
    });
}

function sendSensorDataToPython(data) {
    return new Promise((resolve) => {
        const body = JSON.stringify(data);
        const req = httpRequest(
            {
                host: PYTHON_SENSOR_HOST,
                port: PYTHON_SENSOR_PORT,
                path: PYTHON_SENSOR_PATH,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            },
            (res) => {
                res.on("data", () => { });
                res.on("end", () => resolve(res.statusCode));
            }
        );

        req.on("error", (err) => {
            console.error("Failed to send sensor data to Python server:", err);
            resolve(null);
        });

        req.write(body);
        req.end();
    });
}

function ensureVideoProcess() {
    if (ffmpegProcess) {
        return;
    }

    ffmpegProcess = startFFmpegProcess();
    if (!ffmpegProcess?.stdout) {
        console.error("Failed to start FFmpeg process for video streaming.");
        ffmpegProcess = null;
        return;
    }

    ffmpegProcess.stdout.on("data", (chunk) => {
        videoBuffer = Buffer.concat([videoBuffer, chunk]);

        while (true) {
            const start = videoBuffer.indexOf(Buffer.from([0xff, 0xd8]));
            const end = videoBuffer.indexOf(Buffer.from([0xff, 0xd9]), start);

            if (start !== -1 && end !== -1) {
                const frame = videoBuffer.slice(start, end + 2);
                videoBuffer = videoBuffer.slice(end + 2);
                broadcastVideoFrame(frame);
            } else {
                break;
            }
        }
    });

    ffmpegProcess.on("exit", (code, signal) => {
        console.log(`FFmpeg exited with code=${code}, signal=${signal}`);
        ffmpegProcess = null;
        videoBuffer = Buffer.alloc(0);
    });

    ffmpegProcess.on("error", (err) => {
        console.error("FFmpeg process error:", err);
        stopVideoProcess();
    });
}

videoWss.on("connection", (ws, req) => {
    console.log("Video client connected:", req.url);

    const query = parse(req.url || "", true).query;
    ws.deviceId = query.id;
    ws.deviceType = query.device;

    ensureVideoProcess();

    ws.on("close", () => {
        console.log("Video client disconnected");
        if (videoWss.clients.size === 0) {
            stopVideoProcess();
        }
    });

    ws.on("error", (err) => {
        console.error("Video WebSocket error:", err);
    });
});

sensorWss.on("connection", (ws, req) => {
    console.log("Sensor client connected:", req.url);

    ws.on("message", async (data) => {
        let payload;

        try {
            payload = JSON.parse(data.toString());
        } catch {
            payload = { raw: data.toString() };
        }

        console.log("Sensor data received:", payload);
        await sendSensorDataToPython(payload);
    });

    ws.on("close", () => {
        console.log("Sensor client disconnected");
    });

    ws.on("error", (err) => {
        console.error("Sensor WebSocket error:", err);
    });
});

commandWss.on("connection", (ws) => {
    console.log("Command client connected");

    ws.on("message", (data) => {
        const command = data.toString().trim();

        switch (command) {
            case "GO_LEFT":
            case "GO_RIGHT":
            case "GO_FORWARD":
            case "GO_BACKWARD":
            case "STOP":
                console.log(`${command} command received`);
                commandWss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(command);
                    }
                });
                break;
            default:
                console.log(`Unknown command: ${command}`);
        }
    });

    ws.on("close", () => {
        console.log("Command client disconnected");
    });

    ws.on("error", (err) => {
        console.error("Command WebSocket error:", err);
    });
});

export { app, server };

