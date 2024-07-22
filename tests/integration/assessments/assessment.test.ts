import { ObjectId } from "mongodb";
import { AssessmentRepository } from "../../../src/infra/database/db-repositories/assessment.repository";
import { User } from "../../../src/infra/database/db-repositories/user.repository";

describe("Assessments functional tests", () => {
  let adminToken: string;
  let basicToken: string;
  let adminRoleId: ObjectId;
  let basicRoleId: ObjectId;
  let user: User;
  let assessmentRepository: AssessmentRepository;

  beforeAll(async () => {
    assessmentRepository = new AssessmentRepository(global.APP_MONGODB);

    await global.APP_MONGODB.collection("users").deleteMany({});
    await global.APP_MONGODB.collection("roles").deleteMany({});
    await global.APP_MONGODB.collection("permissions").deleteMany({});
    await global.APP_MONGODB.collection("assessments").deleteMany({});
    await global.APP_MONGODB.collection("sessions").deleteMany({});

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

    const responseUser = await global.APP_MONGODB.collection("users").findOne({
      email: basicUser.email,
    });

    if (responseUser) {
      user = responseUser as User;
    } else {
      throw new Error("User not found");
    }
  });

  describe("Assessment API", () => {
    let assessment: any;

    beforeEach(async () => {
      await global.APP_MONGODB.collection("assessments").deleteMany({});
      assessment = {
        userId: user._id,
        rating: 5,
        comment: "Lorem ipsum",
      };
    });

    describe("POST /api/assessments", () => {
      it("should create a new assessment", async () => {
        const response = await global.APP_TEST_REQUEST.post("/api/assessments")
          .send(assessment)
          .set("Authorization", `Bearer ${basicToken}`);
        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
      });

      it("should return 400 for invalid input", async () => {
        const response = await global.APP_TEST_REQUEST.post("/api/assessments")
          .send({
            userId: "invalid_userId",
            rating: 6,
            comment: 2,
          })
          .set("Authorization", `Bearer ${basicToken}`);
        expect(response.status).toBe(400);
      });
    });

    describe("GET /api/assessments/:assessmentId", () => {
      it("should return an assessment", async () => {
        const createdAssessment = await global.APP_MONGODB.collection(
          "assessments"
        ).insertOne(assessment);
        const response = await global.APP_TEST_REQUEST.get(
          `/api/assessments/${createdAssessment.insertedId}`
        ).set("Authorization", `Bearer ${basicToken}`);
        expect(response.status).toBe(200);
        expect(response.body.assessment).toHaveProperty(
          "comment",
          assessment.comment
        );
      });

      it("should return 404 if assessment not found", async () => {
        const nonExistentId = new ObjectId().toString();
        const response = await global.APP_TEST_REQUEST.get(
          `/api/assessments/${nonExistentId}`
        ).set("Authorization", `Bearer ${basicToken}`);
        expect(response.status).toBe(404);
      });
    });

    describe("GET /api/assessments", () => {
      it("should paginate assessments", async () => {
        const assessments = Array.from({ length: 50 }, (_, i) => ({
          userId: user._id,
          rating: 5,
          comment: `Lorem ipsum ${i + 1}`,
        }));

        await global.APP_MONGODB.collection("assessments").insertMany(
          assessments
        );

        const page = 2;
        const pageSize = 10;

        const response = await global.APP_TEST_REQUEST.get(
          `/api/assessments?page=${page}&pageSize=${pageSize}`
        ).set("Authorization", `Bearer ${basicToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(pageSize);
      });

      it("should return the correct total number of assessments", async () => {
        const assessments = Array.from({ length: 50 }, (_, i) => ({
          userId: user._id,
          rating: 5,
          comment: `Lorem ipsum ${i + 1}`,
        }));

        await global.APP_MONGODB.collection("assessments").insertMany(
          assessments
        );

        const response = await global.APP_TEST_REQUEST.get(
          "/api/assessments?page=1&pageSize=10"
        ).set("Authorization", `Bearer ${basicToken}`);

        expect(response.status).toBe(200);
      });
    });

    describe("PUT /api/assessments/:assessmentId", () => {
      it("should update an assessment", async () => {
        const createdAssessment = await global.APP_MONGODB.collection(
          "assessments"
        ).insertOne(assessment);
        const updatedData = {
          userId: user._id,
          rating: 4,
          comment: "Lorem ipsum_update",
        };

        const response = await global.APP_TEST_REQUEST.put(
          `/api/assessments/${createdAssessment.insertedId}`
        )
          .send(updatedData)
          .set("Authorization", `Bearer ${basicToken}`);

        expect(response.status).toBe(200);

        const updatedAssessment = await global.APP_MONGODB.collection(
          "assessments"
        ).findOne({ _id: createdAssessment.insertedId });
        expect(updatedAssessment?.rating).toBe(updatedData.rating);
        expect(updatedAssessment?.comment).toBe(updatedData.comment);
      });
    });

    describe("DELETE /api/assessments/:assessmentId", () => {
      it("should delete an assessment", async () => {
        const createdAssessment = await global.APP_MONGODB.collection(
          "assessments"
        ).insertOne(assessment);
        const response = await global.APP_TEST_REQUEST.delete(
          `/api/assessments/${createdAssessment.insertedId}`
        ).set("Authorization", `Bearer ${basicToken}`);
        expect(response.status).toBe(204);

        const deletedAssessment = await global.APP_MONGODB.collection(
          "assessments"
        ).findOne({ _id: createdAssessment.insertedId });
        expect(deletedAssessment).toBeNull();
      });
    });
  });
});
