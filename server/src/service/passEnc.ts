import { createCipheriv, createDecipheriv, pbkdf2, randomBytes } from "crypto";
import { EncryptedChatPassword } from "../types/types";

export class clientPassword {
    private salt = randomBytes(16);
    private iterations = 100000;

    private password: string;
    constructor(password: string){
        this.password = password;
    }

    private deriveKey(password: string, salt: Buffer, iterations: number): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            pbkdf2(
                password,
                salt,
                iterations,
                32,
                'sha512',
                (err, derivedKey) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(derivedKey);
                }
            );
        });
    }

    async lockMessage(content: string): Promise<EncryptedChatPassword<"RECEIVE_MESSAGE">> {
        const sharedSecretKey = await this.deriveKey(this.password, this.salt, this.iterations);

        const nonce = randomBytes(12);
        const cipher = createCipheriv('aes-256-gcm', sharedSecretKey, nonce);
        const encrypted = Buffer.concat([cipher.update(content, `utf-8`), cipher.final()]);
        const authTag = cipher.getAuthTag();

        const encryptedContent: EncryptedChatPassword<"RECEIVE_MESSAGE"> = {
            command: "RECEIVE_MESSAGE",
            data: {
                chatID: `FOV_6`,
                encryptedContent: encrypted.toString("base64"),
                nonce: nonce.toString("base64"),
                authTag: authTag.toString("base64"),
                salt: this.salt.toString("base64"),
                iteration: this.iterations
            }
        };

        return encryptedContent;
    };

    async unlockMessage(message: EncryptedChatPassword<"RECEIVE_MESSAGE">): Promise<string | null> {
        const encrypted = Buffer.from(message.data.encryptedContent, "base64");
        const nonce = Buffer.from(message.data.nonce, "base64");
        const authTag = Buffer.from(message.data.authTag, "base64");
        const salt = Buffer.from(message.data.salt, "base64");
        const iterations = message.data.iteration;

        const derivedKey = await this.deriveKey(this.password, salt, iterations);

        const decipher = createDecipheriv('aes-256-gcm', derivedKey, nonce);
        decipher.setAuthTag(authTag);

        try {
            const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
            return decrypted.toString();
        } catch (error) {
            console.error("Decryption Failed.");
            return null
        }
    }
}

