import Elysia, { t } from "elysia";

const rooms = new Map<string, Set<any>>();

export const router = new Elysia().ws('/signaling', {
    body: t.Object({
        type: t.String(),
        room: t.String(),
        data: t.Optional(t.Any()),
    }),
    open(ws) {
        console.log(`[+] WebSocket connected: ${ws.id}`);
    },

    message(ws, message) {
        const { type, room } = message;
        const currentData = message.data as RTCSessionDescription;

        if (!rooms.has(room)) {
            rooms.set(room, new Set());
        }
        const currentRoom = rooms.get(room)!;

        switch (type) {
            case 'join':
                currentRoom.add(ws);
                console.log(`[>] Client ${ws.id} joined room: ${ws.body.room}`);
                break;

            // For all other messages, broadcast them to the other clients in the room
            case 'offer':
            case 'answer':
            case 'candidate':
                currentRoom.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send({ type, currentData });
                    }
                });
                break;
        }
    },

    close(ws) {
        console.log(`[-] WebSocket disconnected: ${ws.id}`);
        const roomName = ws.body;
        if (roomName) {
            const room = rooms.get(roomName);
            room?.delete(ws);
        }
    }
});

