import WebSocket, { WebSocketServer } from "ws";
import { server } from "./commandServer.js";

const wss = new WebSocketServer({ server, path: "/commands" });

const sendToRemoteServer = (command) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            console.log(`Sending command to client: ${command}`);
            client.send(command);
        }
    });
    console.log(`Sending command to remote server: ${command}`);
};

wss.on("connection", (ws) => {

    ws.on("message", (data) => {
        const command = data.toString().trim();

        switch (command) {
            case "GO_LEFT":
            case "GO_RIGHT":
            case "GO_FORWARD":
            case "GO_BACKWARD":
            case "STOP":
                console.log(`${command} command received`);
                sendToRemoteServer(command);
                break;
            default:
                console.log(`Unknown command: ${command}`);
        }
    });

    ws.on("close", () => {
        console.log("disconnected from command WebSocket");
    });

    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
    });
});