import { clientPassword } from "../service/passEnc";
import { EncryptedChatPassword } from "../types/types";

const newSession = new clientPassword();

const message = await newSession.lockMessage("Fu Hua is the hottest one there is.", Bun.env.password as string) as EncryptedChatPassword<"RECEIVE_MESSAGE">;
console.log(message.data.encryptedContent);

const decipher = await newSession.unlockMessage(message, Bun.env.password as string);
console.log(decipher);
