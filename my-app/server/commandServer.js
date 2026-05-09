import express from "express";
import { createServer } from "node:http";

const ip = "192.168.3.5";
const port = 8880;

const app = express();
const server = createServer(app);
server.listen(port, ip, () => {
    console.log(`Server running on http://${ip}:${port}`);
});
export { server };