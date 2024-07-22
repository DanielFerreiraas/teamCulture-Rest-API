import { ObjectId } from "mongodb";
import { createUserService } from "../../../src/domain/user/services/user.create.domain-service";
import { RoleRepository } from "../../../src/infra/database/db-repositories/role.repository";
import { db } from "../../../src/infra/settings/utils/connect";

describe("Roles functional tests", () => {
  let adminToken: string;
  let adminRoleId: ObjectId;
  let permissionId: ObjectId;

  beforeAll(async () => {
    await global.APP_MONGODB.collection("permissions").deleteMany({});
    await global.APP_MONGODB.collection("roles").deleteMany({});
    await global.APP_MONGODB.collection("users").deleteMany({});
    await global.APP_MONGODB.collection("sessions").deleteMany({});
    await global.APP_MONGODB.collection("assessments").deleteMany({});

    const permission = {
      name: "ManageRoles",
      description: "Permission to manage roles",
    };
    const resultPermission = await global.APP_MONGODB.collection(
      "permissions"
    ).insertOne(permission);
    permissionId = resultPermission.insertedId;

    const roleAdmin = {
      name: "Admin",
      description: "Admin role",
      permissions: [permissionId],
    };

    const resultAdminRole = await global.APP_MONGODB.collection(
      "roles"
    ).insertOne(roleAdmin);
    adminRoleId = resultAdminRole.insertedId;

    if (!adminRoleId || !permissionId) {
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
  });

  afterAll(async () => {
    await global.APP_MONGODB.collection("permissions").deleteMany({});
    await global.APP_MONGODB.collection("roles").deleteMany({});
    await global.APP_MONGODB.collection("users").deleteMany({});
    await global.APP_MONGODB.collection("sessions").deleteMany({});
    await global.APP_MONGODB.collection("assessments").deleteMany({});
  });

  describe("POST /api/roles", () => {
    it("should create a new role", async () => {
      const role = {
        name: "Editor",
        description: "Role for editing content",
        permissions: [permissionId],
      };

      const response = await global.APP_TEST_REQUEST.post("/api/roles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(role);

      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();

      const createdRole = await global.APP_MONGODB.collection("roles").findOne({
        name: role.name,
      });
      expect(createdRole).toBeTruthy();
      expect(createdRole?.name).toBe(role.name);
    });

    it("should return 400 for invalid input", async () => {
      const response = await global.APP_TEST_REQUEST.post("/api/roles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          description: "Invalid role without name",
          permissions: [],
        });

      expect(response.status).toBe(400);
    });
  });

  test("should create user when all roles exist", async () => {
    // Crie um role existente para usar no teste
    const existingRoleId = new ObjectId();
    await new RoleRepository(db).create({
      _id: existingRoleId,
      name: "existingRole",
      description: "A role that exists",
      permissions: [],
    });

    const input = {
      email: "test2@example.com",
      name: "Test User 2",
      password: "password123",
      roles: [existingRoleId],
    };

    const response = await createUserService(input);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  describe("GET /api/roles", () => {
    it("should retrieve all roles with pagination", async () => {
      const roles = Array.from({ length: 50 }, (_, i) => ({
        name: `Role ${i + 1}`,
        description: `Description for role ${i + 1}`,
        permissions: [permissionId],
      }));

      await global.APP_MONGODB.collection("roles").insertMany(roles);

      const page = 2;
      const pageSize = 10;

      const response = await global.APP_TEST_REQUEST.get(
        `/api/roles?page=${page}&pageSize=${pageSize}`
      ).set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(pageSize);
    });

    it("should return 400 for invalid pagination parameters", async () => {
      const response = await global.APP_TEST_REQUEST.get(
        "/api/roles?page=-1&pageSize=10"
      ).set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
    });
  });
});
