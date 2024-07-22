import { Db, MongoClient } from "mongodb";
import supertest from "supertest";

declare global {
  var APP_TEST_REQUEST: TestAgent<supertest.SuperTestStatic.Test>;
  var APP_MONGOCLIENT: MongoClient;
  var APP_MONGODB: Db;
}

export {};
