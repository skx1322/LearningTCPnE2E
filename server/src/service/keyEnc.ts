import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { EncryptedChatMessage, ReceivedMessage } from "../types/types";

export class client {
    private sharedSecretKey = randomBytes(32);

    async encryptMessage(content: string) {
        const nonce = randomBytes(12);
        const cipher = createCipheriv(`aes-256-gcm`, this.sharedSecretKey, nonce);

        const encrypted = Buffer.concat([cipher.update(content, `utf-8`), cipher.final()]);

        const authTag = cipher.getAuthTag();

        const encryptedContent: EncryptedChatMessage<"RECEIVE_MESSAGE"> = {
            command: "RECEIVE_MESSAGE",
            data: {
                chat_id: `FOV_6`,
                encrypted_content: encrypted.toString("base64"),
                nonce: nonce.toString("base64"),
                auth_tag: authTag.toString("base64")
            }
        };

        return encryptedContent;
    };

    async decryptMessage(message: EncryptedChatMessage<"RECEIVE_MESSAGE">) {
        const encrypted = Buffer.from(message.data.encrypted_content, "base64");
        const nonce = Buffer.from(message.data.nonce, "base64");

        const authTag = Buffer.from(message.data.auth_tag, "base64");

        const decipher = createDecipheriv('aes-256-gcm', this.sharedSecretKey, nonce);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString();
    }
}

