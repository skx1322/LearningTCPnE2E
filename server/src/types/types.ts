export interface loginSchema {
    username: string;
    user_password: string;
}

export interface userSchema {
    user_id: string,
    username: string,
    user_email: string,
    user_password: string,
    user_avatar: string,
}

export interface KeyExchangeMessage {
    command: 'KEY_EXCHANGE';
    data: {
        user_id: string;
        public_key: string;
    };
}

export type msg_type = "SEND_MESSAGE" | "RECEIVE_MESSAGE"

export interface EncryptedChatMessage<msg_type> {
    command: msg_type;
    data: {
        chat_id: string;
        encrypted_content: string;
        nonce: string;
        auth_tag: string
    };
};

export interface ReceivedMessage {
    command: 'RECEIVE_MESSAGE';
    data: {
        chat_id: string;
        encrypted_content: string;
        nonce: string;//unique encrypt value
    };
};


export interface EncryptedChatPassword<msg_type> {
    command: msg_type;
    data: {
        chat_id: string;
        encrypted_content: string;
        nonce: string;//unique encrypt value
        auth_tag: string
        salt: string,
        iteration: number,
    };
};