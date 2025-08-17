import { clientPassword } from "../service/passEnc";
import { EncryptedChatPassword } from "../types/types";

const newSession = new clientPassword();

const message = await newSession.lockMessage("Fu Hua is the hottest one there is.", "123456") as EncryptedChatPassword<"RECEIVE_MESSAGE">; 
console.log(message.data.encryptedContent);

const decipher = await newSession.unlockMessage(message, "123456");
console.log(decipher);
