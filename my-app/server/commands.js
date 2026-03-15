const WebSocket = require('ws');


const server = require('./server.js').server;

const wss = new WebSocket.Server({ server, path: '/command' });



wss.on('connection', (ws) => {
    console.log('Client connected to command WebSocket');
    ws.on('message', (message) => {
        console.log('Received command:', message);
    });
    ws.on('close', () => {
        console.log('Client disconnected from command WebSocket');
    });
    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});