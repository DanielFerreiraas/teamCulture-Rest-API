import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import http from "http";
import { Db, MongoClient } from "mongodb";
import assessmentRoutes from "./application/api/routes/assessment.routes";
import permissionRoutes from "./application/api/routes/permission.routes";
import roleRoutes from "./application/api/routes/role.routes";
import sessionRoutes from "./application/api/routes/session.routes";
import userRoutes from "./application/api/routes/user.routes";
import { connect } from "./infra/settings/utils/connect";
import log from "./infra/settings/utils/logger";
import swaggerDocs from "./infra/settings/utils/swagger";

dotenv.config();

export class MainApp {
  MONGO_CLIENT!: MongoClient;
  MONGO_DB!: Db;
  SERVER!: http.Server;
  HOST: string = process.env.HOST ? process.env.HOST : "http://localhost";
  PORT: number = this.getEnvPort();
  HOST_URL: string = `${this.HOST?.split(":")[0]}:${this.PORT}`;
  app: Express;

  constructor(port?: number) {
    this.app = express();
    this.PORT = port || (process.env.PORT as unknown as number);
    this.HOST_URL = `${this.HOST}:${this.PORT}`;
    this.configureApp();
  }

  private configureApp() {
    this.app.use(cors());
    this.app.use(express.json());

    sessionRoutes(this.app);
    permissionRoutes(this.app);
    roleRoutes(this.app);
    userRoutes(this.app);
    assessmentRoutes(this.app);
  }

  private async connectToDatabase() {
    const { db, client } = await connect();
    this.MONGO_DB = db;
    this.MONGO_CLIENT = client;
  }

  RunServer() {
    return new Promise((resolve, reject) => {
      this.SERVER = this.app.listen(this.getEnvPort(), () => {
        log.info(process.env.NODE_ENV);
        log.info(`Server is running`);
        const port = (this.SERVER.address() as any)?.port;
        if (port) {
          this.PORT = port;
          this.HOST_URL = `${this.HOST}:${this.PORT}`;
          log.info(`on ${this.HOST_URL}`);
          resolve("Server ONLINE");
        } else {
          reject(new Error("Failed to obtain server port."));
        }
      });
    });
  }

  async stopServer() {
    return new Promise((resolve, reject) => {
      if (this.SERVER) {
        this.SERVER.close((err?: Error) =>
          err ? reject(err) : resolve("Server OFFLINE")
        );
      }
    });
  }

  getEnvPort() {
    switch (process.env.NODE_ENV) {
      case "test":
        return 6000;
      case "development":
        return 4000;
      case "production":
        if (process.env.PORT === undefined) throw Error("Invalid PORT");
        return Number(process.env.PORT);
      default:
        throw new Error(
          "Invalid NODE_ENV choose development, test or production"
        );
    }
  }

  async Run() {
    console.info("Started Server");
    try {
      await this.connectToDatabase();
      log.info("InitDb started");
      await this.RunServer();
      log.info("RunServer started");
      swaggerDocs(this.app, this.PORT);
    } catch (error) {
      log.error(error);
    }
  }
}

if (process.env.NODE_ENV !== "test") {
  const mainApp = new MainApp();
  mainApp.Run();
}

export default MainApp;
