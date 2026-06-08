import WebSocket, { WebSocketServer } from 'ws';

export const startServer = (port = 8080) => {
    const wss = new WebSocketServer({port: port});
    console.log(`[Server] Listening for connections on ws://localhost:${port}`);
    
    const clients = new Set();

    wss.on("connection", (socket) => {
        console.log("A new client has connected!");
        clients.add(socket)

        socket.on('message', (data) => {
            console.log(`[Server] Received message from client: ${data}`);
            
            for (const client of clients) {
                if (client.readyState === WebSocket.OPEN){
                    client.send(data);
                }
            }
        })

        socket.on('close', () => {
            clients.delete(socket)
            console.log("A client has disconnected.");
        })
    })
}