import express from "express";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);

const PORT = 8888;
server.listen(PORT, "192.168.3.5", () => {
    console.log(`HTTP/WS server listening on ${PORT}`);
});

export { app, server };
