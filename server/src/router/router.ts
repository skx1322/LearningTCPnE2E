import Elysia from "elysia";
import { ws } from "../ws/web";


export const router = new Elysia();

    router.group("/tcp", app =>{
        return app.use(ws);
    })