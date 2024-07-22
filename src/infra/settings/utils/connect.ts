import { Db, MongoClient } from "mongodb";
import logger from "./logger";

export let db: Db;
export let client: MongoClient;

export async function connect() {
  try {
    const url = process.env.MONGODB_URL || "mongodb://localhost:27017";

    client = new MongoClient(url);
    await client.connect();
    if (process.env.NODE_ENV == "test") {
      db = client.db("tc-db-test");
      logger.info("Connected to MongoDB Test!");
      return { db, client };
    }
    db = client.db("tc-db");
    return { db, client };
  } catch (error) {
    logger.error("Could not connect to db");
    process.exit(1);
  }
}
