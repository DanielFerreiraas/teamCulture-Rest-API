import { ObjectId } from "mongodb";
import { User } from "../../../src/infra/database/db-repositories/user.repository";

describe("Users functional tests", () => {
  let adminToken: string;
  let basicToken: string;
  let adminRoleId: ObjectId;
  let basicRoleId: ObjectId;

  beforeAll(async () => {
    const permission = {
      name: "Admin",
      description: `Admin permission`,
    };
    await global.APP_MONGODB.collection("permissions").deleteMany({});
    await global.APP_MONGODB.collection("roles").deleteMany({});
    await global.APP_MONGODB.collection("users").deleteMany({});
    await global.APP_MONGODB.collection("sessions").deleteMany({});
    await global.APP_MONGODB.collection("assessments").deleteMany({});

    const resultPermission = await global.APP_MONGODB.collection(
      "permissions"
    ).insertOne(permission);

    const roleAdmin = {
      name: "Admin",
      description: `Admin role`,
      permissions: [resultPermission.insertedId],
    };

    const roleBasic = {
      name: "Basic",
      description: `Basic role`,
      permissions: [resultPermission.insertedId],
    };

    const resultAdminRole = await global.APP_MONGODB.collection(
      "roles"
    ).insertOne(roleAdmin);
    adminRoleId = resultAdminRole.insertedId;

    const resultBasicRole = await global.APP_MONGODB.collection(
      "roles"
    ).insertOne(roleBasic);
    basicRoleId = resultBasicRole.insertedId;

    if (!adminRoleId || !basicRoleId) {
      throw new Error("Failed to create roles or permissions");
    }

    const adminUser = {
      name: "Admin User",
      email: "admin@mail.com",
      password: "123456",
      roles: [adminRoleId],
    };
    await global.APP_TEST_REQUEST.post("/api/users").send(adminUser);

    const adminResponse = await global.APP_TEST_REQUEST.post(
      "/api/sessions"
    ).send({
      email: adminUser.email,
      password: adminUser.password,
    });
    adminToken = adminResponse.body.token;

    const basicUser = {
      name: "Basic User",
      email: "basic@mail.com",
      password: "123456",
      roles: [basicRoleId],
    };
    await global.APP_TEST_REQUEST.post("/api/users").send(basicUser);

    const basicResponse = await global.APP_TEST_REQUEST.post(
      "/api/sessions"
    ).send({
      email: basicUser.email,
      password: basicUser.password,
    });
    basicToken = basicResponse.body.token;
  });

  afterAll(async () => {
    await global.APP_MONGODB.collection("permissions").deleteMany({});
    await global.APP_MONGODB.collection("roles").deleteMany({});
    await global.APP_MONGODB.collection("users").deleteMany({});
    await global.APP_MONGODB.collection("sessions").deleteMany({});
    await global.APP_MONGODB.collection("assessments").deleteMany({});
  });

  describe("User API", () => {
    let user: User;

    beforeAll(() => {
      user = {
        _id: new ObjectId(),
        name: "John Doe",
        email: "john.doe@email.com",
        password: "123456",
        roles: [adminRoleId],
      };
    });

    describe("POST /api/users/", () => {
      it("should create a new user", async () => {
        const response = await global.APP_TEST_REQUEST.post("/api/users")
          .set("Authorization", `Bearer ${adminToken}`)
          .send(user);

        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();

        const createdUser = await global.APP_MONGODB.collection(
          "users"
        ).findOne({
          email: user.email,
        });
        expect(createdUser).toBeTruthy();
        expect(createdUser?.name).toBe(user.name);
      });
    });

    it("should return 400 for invalid input", async () => {
      const response = await global.APP_TEST_REQUEST.post("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          email: "invalid-email",
        });
      expect(response.status).toBe(400);
    });

    describe("GET /api/users/:userId", () => {
      it("should return a user", async () => {
        const createdUser = await global.APP_MONGODB.collection(
          "users"
        ).insertOne(user);
        const response = await global.APP_TEST_REQUEST.get(
          `/api/users/${createdUser.insertedId}`
        ).set("Authorization", `Bearer ${basicToken}`);
        expect(response.status).toBe(200);
        expect(response.body.user).toHaveProperty("email", user.email);
      });

      it("should return 404 if user not found", async () => {
        const nonExistentId = new ObjectId().toString();
        const response = await global.APP_TEST_REQUEST.get(
          `/api/users/${nonExistentId}`
        ).set("Authorization", `Bearer ${basicToken}`);
        expect(response.status).toBe(404);
      });
    });

    describe("GET /api/users Paginated", () => {
      it("should paginate users", async () => {
        const users = Array.from({ length: 50 }, (_, i) => ({
          name: `User ${i + 1}`,
          email: `user${i + 1}@mail.com`,
          password: `password${i + 1}`,
          roles: [basicRoleId],
        }));

        await global.APP_MONGODB.collection("users").insertMany(users);

        const page = 2;
        const pageSize = 10;

        const response = await global.APP_TEST_REQUEST.get(
          `/api/users?page=${page}&pageSize=${pageSize}`
        ).set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(pageSize);
      });

      it("should return the correct total number of users", async () => {
        const users = Array.from({ length: 50 }, (_, i) => ({
          name: `User ${i + 1}`,
          email: `user${i + 1}@mail.com`,
          password: `password${i + 1}`,
          roles: [basicRoleId],
        }));

        await global.APP_MONGODB.collection("users").insertMany(users);

        const response = await global.APP_TEST_REQUEST.get(
          "/api/users?page=1&pageSize=10"
        ).set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
      });
    });

    describe("PUT /api/users/:userId", () => {
      it("should update a user", async () => {
        const updatedData = { name: "Jane Doe" };

        const response = await global.APP_TEST_REQUEST.put(
          `/api/users/${user._id}`
        )
          .set("Authorization", `Bearer ${adminToken}`)
          .send(updatedData);

        expect(response.status).toBe(200);

        const updatedUser = await global.APP_MONGODB.collection(
          "users"
        ).findOne({ _id: user._id });
        expect(updatedUser?.name).toBe(updatedData.name);
      });
    });

    describe("DELETE /api/users/:userId", () => {
      it("should delete a user", async () => {
        const response = await global.APP_TEST_REQUEST.delete(
          `/api/users/${user._id}`
        ).set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(204);

        const deletedUser = await global.APP_MONGODB.collection(
          "users"
        ).findOne({ _id: user._id });
        expect(deletedUser).toBeNull();
      });
    });
  });
});
