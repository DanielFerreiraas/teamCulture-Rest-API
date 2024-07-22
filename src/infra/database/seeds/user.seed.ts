import { Db, ObjectId } from "mongodb";
import { connect } from "../../settings/utils/connect";
import logger from "../../settings/utils/logger";
import {
  Permission,
  PermissionRepository,
} from "../db-repositories/permission.repository";
import { Role, RoleRepository } from "../db-repositories/role.repository";
import { User, UserRepository } from "../db-repositories/user.repository";

async function seedDatabase(db: Db) {
  const userRepository = new UserRepository(db);
  const roleRepository = new RoleRepository(db);
  const permissionRepository = new PermissionRepository(db);

  const existingPermissions = await permissionRepository.findMany(1, 100);
  if (existingPermissions && existingPermissions.total > 0) {
    logger.info("Permissions already exist. Skipping creation.");
  } else {
    const permissions: Permission[] = [
      { name: "create", description: "Create permission" },
      { name: "read", description: "Read permission" },
      { name: "update", description: "Update permission" },
      { name: "delete", description: "Delete permission" },
    ];

    const insertedPermissions = await Promise.all(
      permissions.map((p) => permissionRepository.create(p))
    );

    const permissionIds = insertedPermissions.map((p) => p._id as ObjectId);

    const existingRoles = await roleRepository.findMany(1, 100);
    if (existingRoles && existingRoles.total > 0) {
      logger.info("Roles already exist. Skipping creation.");
    } else {
      const roles: Role[] = [
        {
          name: "Admin",
          description: "Administrator role",
          permissions: permissionIds,
        },
        {
          name: "Basic",
          description: "Basic user role",
          permissions: permissionIds,
        },
      ];

      const insertedRoles = await Promise.all(
        roles.map((r) => roleRepository.create(r))
      );

      const [adminRoleId, basicRoleId] = insertedRoles.map(
        (r) => r._id as ObjectId
      );

      const existingUsers = await userRepository.findMany(1, 100);
      if (existingUsers && existingUsers.total > 0) {
        logger.info("Users already exist. Skipping creation.");
      } else {
        const users: User[] = [
          {
            email: "admin@example.com",
            name: "Admin User",
            password: "admin123",
            roles: [adminRoleId],
          },
          {
            email: "basic@example.com",
            name: "Basic User",
            password: "basic123",
            roles: [basicRoleId],
          },
        ];

        await Promise.all(users.map((u) => userRepository.create(u)));
        logger.info("Database seeded successfully with users!");
      }
    }
  }
}

connect()
  .then(async ({ db }) => {
    try {
      await seedDatabase(db);
      console.info("Seeding completed.");
      process.exit(0);
    } catch (err) {
      logger.error("Error seeding database:", err);
      process.exit(1);
    }
  })
  .catch((err) => {
    logger.error("Error connecting to database:", err);
    process.exit(1);
  });
