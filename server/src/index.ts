import { Elysia } from "elysia";
import { router } from "./router/router";
import { clientPassword } from "./service/passEnc";

const currentPort = <string>process.env.CUSTOM_PORT ?? 3000;

const app = new Elysia()
    .get("/", () => "Hello Elysia")
    .get("/ping", () => "pinging it")
    .listen(currentPort, () => {
        console.log(`Elysia server is operating by port ${currentPort}`)
    });
app.use(router);

const tcpServer = Bun.listen({
    hostname: "0.0.0.0",
    port: 8081,
    socket: {
        open(socket) {
            console.log(`TCP Client Connected from ${socket.remoteAddress}`);
            socket.write("Welcome to the Bun TCP server!\n");
        },

        async data(socket, data) {
            const message = data.toString().trim();
            const session = new clientPassword(<string>Bun.env.PASSWORD_KEY);

            const newMessage = await session.lockMessage(message);

            console.log(`[TCP] Received from ${socket.remoteAddress}: ${newMessage.data.encryptedContent}`);
            if (message.toLowerCase() === 'quit') {
                socket.write("Goodbye!\n");
                socket.end();
                return;
            }

            const decrypted = await session.unlockMessage(newMessage);
            socket.write(`Server echoes: ${decrypted}\n`);
        },

        close(socket) {
            console.log(`[TCP] Client disconnected from ${socket.remoteAddress}`);
        },

        error(socket, error) {
            console.error(`[TCP] An error occurred with ${socket.remoteAddress}:`, error);
        },
    }
});

console.log(`TCP server is running on http://${tcpServer.hostname}:${tcpServer.port}`);
