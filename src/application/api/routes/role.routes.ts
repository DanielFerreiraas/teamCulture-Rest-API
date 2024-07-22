import { Express } from "express";
import deserializeUser from "../../../infra/middlewares/deserializeUser";
import { is } from "../../../infra/middlewares/permission";
import validateResource from "../../../infra/middlewares/validateResource";
import {
  createRoleSchema,
  pagination,
} from "../../../infra/schema/role.schema";
import { createRoleController } from "../controllers/auth/role/role.create.controller";
import { findAllRolesController } from "../controllers/auth/role/role.find-many.controller";

function roleRoutes(app: Express) {
  /**
   * @openapi
   * '/api/roles':
   *  post:
   *     tags:
   *     - Role
   *     summary: Register a role
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateRoleInput'
   *     responses:
   *      200:
   *        description: Success
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post(
    "/api/roles",
    deserializeUser,
    is(["Admin"]),
    validateResource(createRoleSchema),
    createRoleController
  );

  /**
   * @openapi
   * '/api/roles':
   *  get:
   *    tags:
   *    - Role
   *    summary: Find all roles
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
    "/api/roles",
    deserializeUser,
    is(["Admin", "Basic"]),
    [validateResource(pagination)],
    findAllRolesController
  );
}

export default roleRoutes;
