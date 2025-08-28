import { S3Client } from "bun";

export const BUCKET_CONFIG = {
    accessKeyId: Bun.env.DO_ACCESS_KEY_ID,
    secretAccessKey: Bun.env.DO_SECRET_ACCESS_KEY,
    bucket: Bun.env.DO_BUCKET,
    region: Bun.env.DO_REGION,
    endpoint: Bun.env.ENDPOINT,
    S3: function () {
        if (!this.accessKeyId  && !this.secretAccessKey && !this.bucket && !this.region && !this.endpoint) {
            throw("Space Bucket is not properly set up in .env");
        };

        const s3 = new S3Client({
            accessKeyId: BUCKET_CONFIG.accessKeyId,
            secretAccessKey: BUCKET_CONFIG.secretAccessKey,
            bucket: BUCKET_CONFIG.bucket,
            region: BUCKET_CONFIG.region,
            endpoint: BUCKET_CONFIG.endpoint,
        });

        return s3; 
    }
}