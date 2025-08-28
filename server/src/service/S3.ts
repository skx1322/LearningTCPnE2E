import { status } from "elysia";
import { BUCKET_CONFIG } from "../config/global.env";
import { getFileBuffer } from "../utils/bufferFile";
import { UUIDHex } from "../utils/UUID";

const s3 = BUCKET_CONFIG.S3();

export async function uploadImage(image: File): Promise<string> {
    try {
        const buffer = await getFileBuffer(image);
        if (!buffer) {
            console.error("Failed to convert file into buffer.")
            return "";
        }
        const fileExtension = image.name.split('.').pop();
        const uniqueFileName = `imageAsset/${UUIDHex("hex", 2)}.${fileExtension}`;

        const DO_BUCKET = BUCKET_CONFIG.bucket;
        const DO_REGION = BUCKET_CONFIG.region;
        const DO_ENDPOINT = BUCKET_CONFIG.endpoint;

        if (!DO_BUCKET || !DO_REGION || !DO_ENDPOINT) {
            console.error("DigitalOcean Spaces environment variables are not fully configured for URL construction.");
            return "";
        }

        const s3File = s3.file(uniqueFileName, {
            acl: "public-read",
            type: image.type
        });

        await Bun.write(s3File, buffer);

        const imageUrl = `${DO_ENDPOINT}/${DO_BUCKET}/${uniqueFileName}`;
        return imageUrl;
    } catch (error) {
        console.error(`Failed to upload ${image.name} to S3: ${error}`);
        return "";
    }
}

export async function readS3FileAsText(filePath: string): Promise<string> {
    try {
        const s3File = s3.file(filePath);
        const textContent = await s3File.text();
        return textContent;
    } catch (error) {
        console.error(`Failed to read ${filePath} as text from S3:`, error);
        throw error;
    }
}

export async function readS3FileAsArrayBuffer(filePath: string): Promise<ArrayBuffer> {
    try {
        const s3File = s3.file(filePath);
        const buffer = await s3File.arrayBuffer();
        return buffer;
    } catch (error) {
        console.error(`Failed to read ${filePath} as ArrayBuffer from S3:`, error);
        throw error;
    }
}

export async function deleteS3File(filePath: string): Promise<boolean> {
    try {
        const file = new URL(filePath).pathname.slice(15)
        const s3File = s3.file(`${file}`);

        const isExist = await s3File.exists();
        if (!isExist) {
            console.error(`File ${isExist} does not exist.`)
            return false;
        }

        await s3File.delete();

        const AfterCheck = await s3File.exists();
        if (AfterCheck) {
            console.log(`File still exist ${file}`);
            return false;
        };
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
