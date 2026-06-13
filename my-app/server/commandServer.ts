import express from "express";
import { createServer } from "node:http";

const ip = "0.0.0.0";
const port = 8880;

const app = express();
const server = createServer(app);
server.listen(port, ip, () => {
    console.log(`Server running on http://${ip}:${port} esp-32`);
});
export { server };

