import { Elysia } from "elysia";
import { router } from "./router/router";
import { DB } from "./db/connect";

const currentPort = <number><unknown>process.env.CUSTOM_PORT || 3000;

const app = new Elysia()
    .get("/", () => "Hello Elysia")
    .onStart(async ({ server }) => {
        console.log(`Elysia server starting on port ${server?.port}`);
        try {
            await DB`SELECT 1`;
            console.log('Database connection verified on startup.');
        } catch (error) {
            console.error('Failed to verify database connection:', error);
        }
    })
    .listen(currentPort);
app.use(router);