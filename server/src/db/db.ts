import { status } from "elysia";
import { UUIDHex } from "../utils/UUID";
import DB from "./connect";
import { DB_MODEL } from "./model";
import { chatSchema, userSchema } from "../types/types";

class DB_CHAT {
    createUser(username: string) {
        const user_id = UUIDHex("hex", 3);
        const public_key = UUIDHex("hex", 0);

        try {
            const insert = DB.prepare(DB_MODEL.insertUser())
            insert.run(user_id, username, public_key);

            const isExist = this.getUser(user_id);
            if (!isExist) {
                return status(500, {
                    success: false,
                    message: `Failed to create user.`
                });
            }
            return isExist.user_id
        } catch (error) {
            console.error(error)
        }
    };

    getUser(user_id: string) {
        const query = `SELECT user_id, username FROM users WHERE user_id = $user_id OR username = $user_id`;
        try {
            const read = DB.query(query).get({ $user_id: user_id }) as Pick<userSchema, "user_id" | "username">;
            return read
        } catch (error) {
            console.error(error);
        }
    };

    deleteUser(user_id: string) {
        const query = `DELETE FROM users WHERE user_id = $user_id`;
        try {
            const read = DB.query(query).get({ $user_id: user_id });
            return read
        } catch (error) {
            console.error(error);
        }
    };

    createChat(chat_name: string) {
        const chat_id = UUIDHex("hex", 0);
        try {
            const create = DB.prepare(DB_MODEL.createChat());
            create.run(chat_id, chat_name);

            const isExist = this.scanChat(chat_id);
            if (!isExist) {
                return status(500, {
                    success: false,
                    message: `Server failed to create chat room.`
                });
            };

            return isExist;
        } catch (error) {
            console.error(error);
        };
    };

    scanChat(chat_id: string) {
        const query = `SELECT * FROM chats WHERE chat_id = $chat_id`;
        try {
            const read = DB.query(query).get({$chat_id: chat_id}) as chatSchema;
            return read;
        } catch (error) {
            console.error(error);
        }
    };

    findChat() {
        const query = `SELECT * FROM chats`;
        try {
            const read = DB.query(query).all() as chatSchema[];
            return read;
        } catch (error) {
            console.error(error);
        }
    };
}

export default DB_CHAT;