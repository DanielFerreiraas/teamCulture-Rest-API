import { ObjectId } from "mongodb";

describe("Permissions functional tests", () => {
  let adminToken: string;
  let basicToken: string;
  let adminRoleId: ObjectId;
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

    const roleAdmin = {
      name: "Admin",
      description: "Admin role",
      permissions: [resultPermission.insertedId],
    };

    const roleBasic = {
      name: "Basic",
      description: "Basic role",
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

  describe("POST /api/permissions", () => {
    it("should create a new permission", async () => {
      const permission = {
        name: "Create",
        description: "Permission to create resources",
      };

      const response = await global.APP_TEST_REQUEST.post("/api/permissions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(permission);

      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();

      const createdPermission = await global.APP_MONGODB.collection(
        "permissions"
      ).findOne({
        name: permission.name,
      });
      expect(createdPermission).toBeTruthy();
      expect(createdPermission?.name).toBe(permission.name);
    });

    it("should return 400 for invalid input", async () => {
      const response = await global.APP_TEST_REQUEST.post("/api/permissions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          description: "Invalid permission without name",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/permissions", () => {
    it("should retrieve all permissions with pagination", async () => {
      const permissions = Array.from({ length: 50 }, (_, i) => ({
        name: `Permission ${i + 1}`,
        description: `Description for permission ${i + 1}`,
      }));

      await global.APP_MONGODB.collection("permissions").insertMany(
        permissions
      );

      const page = 2;
      const pageSize = 10;

      const response = await global.APP_TEST_REQUEST.get(
        `/api/permissions?page=${page}&pageSize=${pageSize}`
      ).set("Authorization", `Bearer ${basicToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(pageSize);
    });

    it("should return 400 for invalid pagination parameters", async () => {
      const response = await global.APP_TEST_REQUEST.get(
        "/api/permissions?page=-1&pageSize=10"
      ).set("Authorization", `Bearer ${basicToken}`);

      expect(response.status).toBe(400);
    });
  });
});
