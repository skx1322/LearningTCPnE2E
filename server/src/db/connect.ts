import { Database } from "bun:sqlite";

const DB = new Database("./data/HuaDB0.sqlite", {create: true});

export default DB;