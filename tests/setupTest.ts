import supertest from "supertest";
import MainApp from "../src/app";

let app: MainApp;

beforeAll(async () => {
  app = new MainApp();
  await app.Run();
  global.APP_TEST_REQUEST = supertest(app.app);
  global.APP_MONGOCLIENT = app.MONGO_CLIENT;
  global.APP_MONGODB = app.MONGO_DB;
});

afterAll(async () => {
  await app.MONGO_CLIENT.close();
  await app.stopServer();
});
