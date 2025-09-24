import Elysia, { t } from "elysia";

const rooms = new Map<string, Set<any>>();
const clients = new Set<any>();

export const chatSocket = new Elysia().ws('/ws', {
    body: t.Object({
        command: t.Optional(t.String()),
        payload: t.Optional(t.String()),
        username: t.Optional(t.String())
    }),

    open(ws) {
        console.log(`[+] WebSocket connected: ${ws.id}`);

        clients.forEach(client => {
            client.send(JSON.stringify({
                user: "SERVER",
                message: `User ${ws.id} has join the chat.`
            }));
        });
        clients.add(ws);
    },

    message(ws, message) {
        const { command, payload, username } = message;
        console.log(`${username ?? ws.id}: ${payload}`);

        clients.forEach(client => {
            if (client !== ws) {
                client.send(JSON.stringify({
                    user: `${username ?? ws.id}`,
                    message: payload
                }))
            }
        })
    },

    close(ws) {
        console.log(`[-] WebSocket disconnected: ${ws.id}`);
        clients.delete(ws);

        clients.forEach(client => {
            client.send(JSON.stringify({
                user: "SERVER",
                message: `User ${ws.id} has left the chat.`
            }));
        });
    }
});