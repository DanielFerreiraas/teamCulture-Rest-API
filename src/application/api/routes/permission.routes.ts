import { Express } from "express";
import deserializeUser from "../../../infra/middlewares/deserializeUser";
import { is } from "../../../infra/middlewares/permission";
import validateResource from "../../../infra/middlewares/validateResource";
import {
  createPermissionSchema,
  pagination,
} from "../../../infra/schema/permission.schema";
import { createPermissionController } from "../controllers/auth/permission/permission.controller";
import { findAllPermissionsController } from "../controllers/auth/permission/permission.find-many.controller";

function permissionRoutes(app: Express) {
  /**
   * @openapi
   * '/api/permissions':
   *  post:
   *     tags:
   *     - Permission
   *     summary: Register a permission
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreatePermissionInput'
   *     responses:
   *      200:
   *        description: Success
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post(
    "/api/permissions",
    deserializeUser,
    is(["Admin"]),
    validateResource(createPermissionSchema),
    createPermissionController
  );

  /**
   * @openapi
   * '/api/permissions':
   *  get:
   *    tags:
   *    - Permission
   *    summary: Find all permissions
   *    parameters:
   *      - name: page
   *        in: query
   *        description: Page number for pagination
   *        required: false
   *        schema:
   *          type: integer
   *          default: 1
   *      - name: pageSize
   *        in: query
   *        description: Number of assessments per page
   *        required: false
   *        schema:
   *          type: integer
   *          default: 10
   *    responses:
   *      200:
   *        description: Success
   *      400:
   *        description: Bad Request
   *      500:
   *        description: Internal Server Error
   */
  app.get(
    "/api/permissions",
    deserializeUser,
    is(["Admin", "Basic"]),
    [validateResource(pagination)],
    findAllPermissionsController
  );
}

export default permissionRoutes;
