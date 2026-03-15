// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';

// const app = express();
// const server = createServer(app);
// const io = new Server(server);
// const ip = '192.168.3.5';
// const port = 3000;
// io.on('connection', (socket) => {
//     console.log('a user connected:', socket.id);
//     socket.on('message', (data) => {
//         if (Buffer.isBuffer(data)) {
//             // This is your video frame!
//             console.log("Received binary data of length:", data.length);
//         }
//     });
//     socket.on('CONNECT_WIFI', (msg) => {
//         io.emit('message', msg);
//         console.log('CONNECT_WIFI received:', msg);
//     });
//     socket.on('QUIT_WIFI', (msg) => {
//         io.emit('message', msg);
//         console.log('QUIT_WIFI received:', msg);
//     });
//     socket.on('video', (msg) => {
//         console.log('video received:', msg);
//     });
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
// });

// server.listen(port, () => {
//     console.log(`server running at http://${ip}:${port}/`);
// });


// server.js
const { Buffer } = require('node:buffer');
const WebSocket = require('ws');
const { startFFmpegProcess } = require('./videoProcessor.js');
const server = require('./server.js').server;

const wss = new WebSocket.Server({ server, path: '/video' });
const url = require('url');
wss.on('connection', (ws, req) => {
    console.log('Client connected');
    const query = url.parse(req.url, true).query;
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
                console.log("Ура! Знайдено початок кадру в цьому чанку!");
                const frame = buffer.slice(start, end + 2);
                buffer = buffer.slice(end + 2);
                const isIosConnected = [...wss.clients].some(
                    w => w.deviceType === 'ios' && w.deviceId === 'user123'
                );
                if (ws.readyState === WebSocket.OPEN && isIosConnected) {
                    console.log("opened")
                    // if (ws.bufferedAmount < 1024 * 1024) { // Менше 1MB і кожні 1KB
                    console.log("Відправляємо кадр розміром:", frame.length);
                    ws.send(frame, (err) => {
                        if (err) console.error("Send error:", err);
                    });

                    // }
                    // else {
                    //     console.log("too large", ws.bufferedAmount);
                    // }
                }
            } else {
                break;
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        if (ffmpegProcess) ffmpegProcess.kill();
    });

    ws.on('error', (err) => {
        console.error("WS Error:", err);
        if (ffmpegProcess) ffmpegProcess.kill();
    });
});
