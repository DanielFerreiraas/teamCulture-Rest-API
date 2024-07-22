import { ObjectId } from "mongodb";
import {
  createSessionService,
  findOneSessionByIdService,
  findSessionByTokenService,
} from "../../../src/domain/auth/session/services/session.create.domain-service";

describe("Session Endpoints Tests", () => {
  let token: string;
  let sessionId: string;
  let userId: string;
  let basicRoleId: ObjectId;

  beforeAll(async () => {
    await global.APP_MONGODB.collection("permissions").deleteMany({});
    await global.APP_MONGODB.collection("roles").deleteMany({});
    await global.APP_MONGODB.collection("users").deleteMany({});
    await global.APP_MONGODB.collection("sessions").deleteMany({});
    await global.APP_MONGODB.collection("assessments").deleteMany({});

    const permission = {
      name: "Basic",
      description: "Basic permission",
    };
    const resultPermission = await global.APP_MONGODB.collection(
      "permissions"
    ).insertOne(permission);

    const roleBasic = {
      name: "Basic",
      description: "Basic role",
      permissions: [resultPermission.insertedId],
    };

    const resultBasicRole = await global.APP_MONGODB.collection(
      "roles"
    ).insertOne(roleBasic);
    basicRoleId = resultBasicRole.insertedId;

    if (!basicRoleId) {
      throw new Error("Failed to create roles or permissions");
    }

    const basicUser = {
      name: "Basic User",
      email: "basicuser@example.com",
      password: "password",
      roles: [basicRoleId],
    };
    const userResponse = await global.APP_TEST_REQUEST.post("/api/users").send(
      basicUser
    );
    userId = userResponse.body._id;

    const sessionResponse = await global.APP_TEST_REQUEST.post(
      "/api/sessions"
    ).send({
      email: basicUser.email,
      password: basicUser.password,
    });
    token = sessionResponse.body.token;
    sessionId = sessionResponse.body.sessionId;
  });

  afterAll(async () => {
    await global.APP_MONGODB.collection("permissions").deleteMany({});
    await global.APP_MONGODB.collection("roles").deleteMany({});
    await global.APP_MONGODB.collection("users").deleteMany({});
    await global.APP_MONGODB.collection("sessions").deleteMany({});
    await global.APP_MONGODB.collection("assessments").deleteMany({});
  });

  describe("POST /api/sessions", () => {
    it("should create a new session and return a token", async () => {
      const user = {
        name: "Another Test User",
        email: "anothertestuser@example.com",
        password: "password",
        roles: [basicRoleId],
      };
      await global.APP_TEST_REQUEST.post("/api/users").send(user);

      const response = await global.APP_TEST_REQUEST.post("/api/sessions").send(
        {
          email: user.email,
          password: user.password,
        }
      );

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it("should return 400 for invalid credentials", async () => {
      const response = await global.APP_TEST_REQUEST.post("/api/sessions").send(
        {
          email: "invalid@example.com",
          password: "wrongpassword",
        }
      );

      expect(response.status).toBe(400);
    });
  });

  describe("createSessionService", () => {
    it("should create a new session and return a token", async () => {
      const result = await createSessionService(userId);
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
    });

    it("should update an existing session with a new token", async () => {
      const oldToken = token;
      const result = await createSessionService(userId);
      expect(result.success).toBe(true);
      expect(result.token).not.toBe(oldToken);
    });
  });

  describe("findSessionByTokenService", () => {
    it("should find a session by token", async () => {
      const result = await findSessionByTokenService(token);
      expect(result.success).toBe(true);
      expect(result.session).toBeDefined();
      expect(result.session?.token).toBe(token);
    });

    it("should return false for an invalid token", async () => {
      const result = await findSessionByTokenService("invalid_token");
      expect(result.success).toBe(false);
    });
  });

  describe("findOneSessionByIdService", () => {
    it("should find a session by ID", async () => {
      const result = await findOneSessionByIdService(sessionId);
      expect(result.session?._id!.toString()).toBe(sessionId);
    });

    it("should return false for an invalid session ID", async () => {
      const result = await findOneSessionByIdService("invalid_session_id");
      expect(result.success).toBe(false);
    });
  });
});
