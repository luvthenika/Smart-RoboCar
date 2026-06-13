import WebSocket, { WebSocketServer } from "ws";
import { server } from "./commandServer.ts";

const wss = new WebSocketServer({ server, path: "/esp-32" });



const sendToRemoteServer = (command) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.role === "esp-32") {
            console.log(`Sending command to esp32: ${command}`);
            client.send(command);
        }
    });
};

wss.on("connection", (ws, req) => {
    const url = new URL(req.url || "", `ws://${req.headers.host}`);
    ws.role = url.searchParams.get("role") || "client";

    console.log(`New ws connection role=${ws.role}`);

    ws.on("message", (data) => {
        const message = data.toString().trim();
        if (ws.role === "python") {
            console.log(`Python message received: ${message}`);
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN && client.role === "client") {
                    console.log(`Sending Python data to client: ${message}`);
                    client.send(message);
                }
            });
            return;
        }

        const command = message;
        switch (command) {
            case "GO_LEFT":
            case "GO_RIGHT":
            case "GO_FORWARD":
            case "GO_BACKWARDS":
            case "SMART_MODE":
            case "MANUAL_MODE":
            case "STOP":
                console.log(`${command} command received from client`);
                sendToRemoteServer(command);
                break;
            default:
                console.log(`Unknown command from client: ${command}`);
        }
    });

    ws.on("close", () => {
        console.log(`WebSocket disconnected role=${ws.role}`);
    });

    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
    });
});