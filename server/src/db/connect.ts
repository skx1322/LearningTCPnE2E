import { neon } from '@neondatabase/serverless';

const url = Bun.env.DB_KEY as string;
export const sql = neon(url);

