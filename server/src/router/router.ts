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
        const { type, room, data } = message;

        if (!rooms.has(room)) {
            rooms.set(room, new Set());
        }
        const currentRoom = rooms.get(room)!;

        switch (type) {
            case 'join':
                currentRoom.add(ws);
                ws.body.room = room; 
                console.log(`[>] Client ${ws.id} joined room: ${room}`);
                break;

            // For all other messages, broadcast them to the other clients in the room.
            case 'offer':
            case 'answer':
            case 'candidate':
                currentRoom.forEach(client => {
                    // Send to everyone else in the room.
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        // ✨ FIX: Send the message with the 'data' key, not 'currentData'.
                        // We also don't need to wrap it in JSON.stringify, Elysia does that.
                        client.send({ type, data });
                    }
                });
                break;
        }
    },

    close(ws) {
        console.log(`[-] WebSocket disconnected: ${ws.id}`);
        // ✨ IMPROVEMENT: Reliably get the room name from the connection's data.
        const roomName = ws.body; 
        if (roomName) {
            const room = rooms.get(roomName);
            if (room) {
                room.delete(ws);
                console.log(`[<] Client ${ws.id} removed from room: ${roomName}`);
                // Optional: Clean up empty rooms
                if (room.size === 0) {
                    rooms.delete(roomName);
                    console.log(`[x] Room ${roomName} is now empty and has been deleted.`);
                }
            }
        }
    }
});