import { Elysia } from 'elysia'

export const ws = new Elysia()
    .ws('/ws', {
        message(ws, message) {
            ws.send(message)
        }
    })