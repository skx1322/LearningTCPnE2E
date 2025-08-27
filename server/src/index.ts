import { Elysia } from "elysia";
import { router } from "./router/router";
// import { clientPassword } from "./service/passEnc";
// import { websocket } from "@elysiajs/websocket";


const currentPort = <string>process.env.CUSTOM_PORT ?? 3000;

const app = new Elysia()
    // .use(websocket())
    .get("/", () => "Hello Elysia")
    .ws('/ws', {
        open(ws) {
            console.log(`[WS] Client connected with ID: ${ws.data.server}`);
            ws.send({ command: "INFO", message: "Welcome to the Elysia WebSocket server!" });
        },
        message(ws, message) {
            console.log(`[WS] Received from ${ws.data.server}:`, message);
            ws.send({ command: "ECHO", data: message });
        },
        close(ws) {
            console.log(`[WS] Client disconnected: ${ws.data.server}`);
        },
    })
    .listen(currentPort, () => {
        console.log(`Elysia server is operating by port ${currentPort}`)
    });
app.use(router);

// const tcpServer = Bun.listen({
//     hostname: "0.0.0.0",
//     port: 8081,
//     socket: {
//         open(socket) {
//             console.log(`TCP Client Connected from ${socket.remoteAddress}`);
//             socket.write("Welcome to the Bun TCP server!\n");
//         },

//         async data(socket, data) {
//             const message = data.toString().trim();
//             const session = new clientPassword(<string>Bun.env.PASSWORD_KEY);

//             const newMessage = await session.lockMessage(message);

//             console.log(`[TCP] Received from ${socket.remoteAddress}: ${newMessage.data.encrypted_content}`);
//             if (message.toLowerCase() === 'quit') {
//                 socket.write("Goodbye!\n");
//                 socket.end();
//                 return;
//             }

//             const decrypted = await session.unlockMessage(newMessage);
//             socket.write(`Server echoes: ${decrypted?.toUpperCase()}\n`);
//         },

//         close(socket) {
//             console.log(`[TCP] Client disconnected from ${socket.remoteAddress}`);
//         },

//         error(socket, error) {
//             console.error(`[TCP] An error occurred with ${socket.remoteAddress}:`, error);
//         },
//     }
// });

// console.log(`TCP server is running on http://${tcpServer.hostname}:${tcpServer.port}`);
