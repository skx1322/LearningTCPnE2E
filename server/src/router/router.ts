import Elysia, { t } from "elysia";
import { chatSocket } from "../controllers/websocket";

const rooms = new Map<string, Set<any>>();
const clients = new Set<any>();

export const router = new Elysia();
router.use(chatSocket)