import WebSocket from 'ws' 
import readline from 'readline'

export const connectToServer = (port = 8080) => {
    const serverUrl = `ws://localhost:${port}`
    const socket = new WebSocket(serverUrl)

    console.log(`[Client] Attempting to connect to server`);
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    socket.on('open', () => {
        console.log(`[Client] Connected to server`);
    })

    socket.on('message', (data) => {
        console.log(`\n[Client] Message Received: ${data.toString()}`);
    })

    rl.on("line", (input) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(input);
        } else {
            console.log(`[Client] Please wait, still connecting...`);
        }
    })
}