import { Elysia } from "elysia";
import { router } from "./router/router";
import { clientPassword } from "./service/passEnc";
// import { clientPassword } from "./service/passEnc";
// import { websocket } from "@elysiajs/websocket";


const currentPort = <string>process.env.CUSTOM_PORT ?? 3000;

const app = new Elysia()
    .get("/", () => "Hello Elysia")
    .use(router)
    .listen(currentPort, () => {
        console.log(`Elysia server is operating by port ${currentPort}`)
    });
