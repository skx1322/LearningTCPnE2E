import DB from "./connect";

export namespace DB_MODEL {
    export function userTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS users(
                user_id VARCHAR(50) PRIMARY KEY UNIQUE,
                username VARCHAR(50),
                public_key TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        return query;
    };

    export function chatTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS chats(
                chat_id VARCHAR(50) PRIMARY KEY UNIQUE,
                chat_name VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        return query;

    };

    export function messageTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS messages(
                message_id VARCHAR(50) PRIMARY KEY,
                chat_id VARCHAR(50) NOT NULL,
                sender_id VARCHAR(50) NOT NULL,
                encrypted_content TEXT NOT NULL,
                nonce TEXT NOT NULL,
                auth_tag TEXT NOT NULL,
                send_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE,
                FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE SET NULL
            )
        `
        return query;

    };

    export function insertUser() {
        const query = `
            INSERT INTO users (user_id, username, public_key) VALUES ($user_id, $username, $public_key)
        `
        return query;
    };

    export function createChat() {
        const query = `
            INSERT INTO chats (chat_id, chat_name) VALUES ($chat_id, $chat_name)
        `
        return query;
    }
};

export function createTABLE() {
    const user = DB.prepare(DB_MODEL.userTable())
    const chat = DB.prepare(DB_MODEL.chatTable())
    const message = DB.prepare(DB_MODEL.messageTable())
    user.run();
    chat.run();
    message.run();
}

createTABLE();