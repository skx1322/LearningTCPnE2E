import Elysia, { t } from "elysia";

const clients = new Set<any>();

export const videoSocket = new Elysia().ws('/video', {
    body: t.Object({
        type: t.String(),
        data: t.Any() 
    }),

    open(ws) {
        console.log(`[+] WebSocket connected: ${ws.id}`);
        clients.add(ws);
    },

    message(ws, message) {
        console.log(`[*] Received message of type "${message.type}" from ${ws.id}`);
        console.log(message);
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    },

    close(ws) {
        console.log(`[-] WebSocket disconnected: ${ws.id}`);
        clients.delete(ws);
    }
});
