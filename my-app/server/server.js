import { createServer } from 'node:http';
import express from 'express';

const ip = '192.168.3.5';
const port = 8888;

const app = express();
const server = createServer(app);
server.listen(port, ip, () => {
    console.log(`Server running on http://${ip}:${port}`);
});
export { server };
