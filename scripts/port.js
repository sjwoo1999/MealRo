#!/usr/bin/env node
const net = require('net');
const { spawn } = require('child_process');

const BASE_PORT = parseInt(process.env.PORT ?? '3000', 10);
const command = process.argv[2] ?? 'dev'; // 'dev' | 'start'

function findAvailablePort(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(port, () => {
            server.close(() => resolve(port));
        });
        server.on('error', () => resolve(findAvailablePort(port + 1)));
    });
}

findAvailablePort(BASE_PORT).then((port) => {
    if (port !== BASE_PORT) {
        console.log(`⚡ Port ${BASE_PORT} in use → using port ${port}`);
    }
    console.log(`🚀 Starting Next.js (${command}) on http://localhost:${port}`);
    spawn('npx', ['next', command, '-p', String(port)], {
        stdio: 'inherit',
        shell: false,
    });
});
