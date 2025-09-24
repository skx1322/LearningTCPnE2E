namespace bufferUtil {
    export async function getFileBuffer(image: File): Promise<Buffer | undefined> {
        try {
            const buffer = await image.arrayBuffer();
            const fileBuffer = Buffer.from(buffer);
            return fileBuffer;
        } catch (error) {
            console.error("Failed to convert file into buffers.")
        }
    }

    export async function getFileString(image: ArrayBuffer) {
        try {
            const fileBuffer = Buffer.from(image).toString("base64");
            return fileBuffer;
        } catch (error) {
            console.error("Failed to convert file into buffers.")
        }
    }

    export async function stringBuffer(image: string) {
        try {
            const fileBuffer = Buffer.from(image, "base64").buffer;
            return fileBuffer;
        } catch (error) {
            console.error("Failed to convert file into buffers.")
        }
    }
}

export default bufferUtil;

