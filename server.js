import WebSocket, { WebSocketServer } from 'ws';

export const startServer = (port = 8080) => {
    const wss = new WebSocketServer({port: port});
    console.log(`[Server] Listening for connections on ws://localhost:${port}`);
    
    const clients = new Set();
    let clientIdCounter = 1;

    wss.on("connection", (socket) => {
        socket.id = clientIdCounter++
        console.log(`Client ${socket.id} has connected!`);
        clients.add(socket)
        // console.log({clients});
        

        socket.on('message', (data) => {
            console.log(`[Server] Received message from client ${socket.id}: ${data.toString()}`);
            
            for (const client of clients) {
                if (client.id !== socket.id) {
                    if (client.readyState === WebSocket.OPEN){
                        client.send(`Client ${socket.id}: ${data.toString()}`);
                    }
                }
            }
        })

        socket.on('close', () => {
            clients.delete(socket)
            console.log(`Client ${socket.id} has disconnected.`);
        })
    })

    process.on('SIGINT', () => {
        console.log("\n[Server] Initiating graceful shutdown...");

        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.close(1000, "Server shutting down"); 
            }
        }

        wss.close(() => {
            console.log("[Server] All connections closed. Goodbye!");
            process.exit(0); 
        });
    });
}