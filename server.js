import WebSocket, { WebSocketServer } from 'ws';

export const startServer = (port = 8080) => {
    const wss = new WebSocketServer({port: port,
        handleProtocols: (protcols, request) => {
            console.log(`[Handshake] Client requested specific protocols: ${Array.from(protcols)}`)

            const supportedProtocols = ['cli-chat-v1']
            for (const protocol of protcols) {
                if (supportedProtocols.includes(protocol)) {
                    return protocol
                }
            }
            return False
        }
    });
    console.log(`[Server] Listening for connections on ws://localhost:${port}`);
    
    const clients = new Set();
    let clientIdCounter = 1;

    wss.on("connection", (socket) => {
        console.log(`[Server] Connected to client with ${socket.protocol} Protocol`);
        
        socket.id = clientIdCounter++
        console.log(`Client ${socket.id} has connected!`);

        socket.isAlive = True

        clients.add(socket)

        socket.on('pong', () => {
            socket.isAlive = True
        })

        socket.on('message', (data) => {
            console.log(`[Server] Received message from client ${socket.id}: ${data.toString()}`);
            
            for (const client of clients) {
                if (client !== socket && client.readyState === WebSocket.OPEN) {
                    client.send(`Client ${socket.id}: ${data.toString()}`);
                }
            }
        });

        socket.on('close', () => {
            clients.delete(socket)
            console.log(`Client ${socket.id} has disconnected.`);
        })
    })

     const interval = setInterval(() => {
        for (const client of clients) {
            if (client.isAlive === False) {
                console.log(`[Server] Client ${client.id} timed out. Terminating.`);
                clients.delete(client);
                return client.terminate();
            }
            client.isAlive = False
            client.ping()
        }
     }, 30000)

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

        clearInterval(interval);
    });
}