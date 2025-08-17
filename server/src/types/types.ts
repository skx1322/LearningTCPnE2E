export interface userSchema {
    userID: string,
    username: string,
    userEmail: string,
    userPassword: string,
    userAvatar: string,
}

export interface KeyExchangeMessage {
    command: 'KEY_EXCHANGE';
    data: {
        userID: string;
        publicKey: string;
    };
}

export type msg_type = "SEND_MESSAGE" | "RECEIVE_MESSAGE"

export interface EncryptedChatMessage<msg_type> {
    command: msg_type;
    data: {
        chatID: string;
        encryptedContent: string;
        nonce: string;//unique encrypt value
        authTag: string
    };
};

export interface ReceivedMessage {
    command: 'RECEIVE_MESSAGE';
    data: {
        chatID: string;
        encryptedContent: string;
        nonce: string;//unique encrypt value
    };
};


export interface EncryptedChatPassword<msg_type> {
    command: msg_type;
    data: {
        chatID: string;
        encryptedContent: string;
        nonce: string;//unique encrypt value
        authTag: string
        salt: string,
        iteration: number,
    };
};