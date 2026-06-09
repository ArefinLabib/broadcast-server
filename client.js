import WebSocket from 'ws' 
import readline from 'readline'

export const connectToServer = (port = 8080) => {
    const serverUrl = `ws://localhost:${port}`
    const protocols = ['cli-chat-v1', 'cli-json-v1']
    const socket = new WebSocket(serverUrl, protocols)

    console.log(`[Client] Attempting to connect to server`);
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    socket.on('open', () => {
        console.log(`[Client] Connected to server`);
    })

    socket.on('message', (data) => {
        console.log(`\n[Client] ${data.toString()}`);
    })

    rl.on("line", (input) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(input);
        } else {
            console.log(`[Client] Please wait, still connecting...`);
        }
    })

    socket.on('close', (code, reason) => {
        console.log(`\n[Client] Disconnected from server. Reason: ${reason.toString()}`);

        rl.close(); 
        process.exit(0); 
    });
}