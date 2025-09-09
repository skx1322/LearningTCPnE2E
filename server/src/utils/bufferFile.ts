const path = "./tmp/"
const name = 'guitar.mp4'
const output = `guitar.txt`

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

const file = Bun.file(`${path}${name}`);

const arrayBuffer = await getFileString(await file.arrayBuffer()) as string;
await Bun.write(`${path}${output}`, arrayBuffer)

const fileOutput = await Bun.file(`${path}${output}`).text();

const fileString = await stringBuffer(fileOutput) as ArrayBuffer;
await Bun.write(`${path}guitarOutput.mp4`, fileString)

