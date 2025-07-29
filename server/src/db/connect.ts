import { SQL } from "bun";

const url = `postgresql://${process.env.db_username}:${process.env.db_password}@${process.env.db_hostname}:${process.env.db_port || 5432}/${process.env.db_database}`

export const DB = new SQL({
    url: url,
    hostname: process.env.db_hostname as string,
    database: process.env.db_database as string,
    port: process.env.db_port || 5432,
    username: process.env.db_username as string,
    password: process.env.db_password as string,
    
    onconnect: client => {
        console.log("Conneceted to database");
    },
    onclose: client => {
        console.log("Connection closed");
    }
})

async function checkDbConnection() {
    try {
        await DB`SELECT 1`;
        console.log('Database connection pool is ready.');
    } catch (error) {
        console.error('Failed to establish initial database connection:', error);
        process.exit(1); 
    }
}

await checkDbConnection();