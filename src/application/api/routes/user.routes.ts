import { Express } from "express";
import deserializeUser from "../../../infra/middlewares/deserializeUser";
import { is } from "../../../infra/middlewares/permission";
import validateResource from "../../../infra/middlewares/validateResource";
import {
  createUserSchema,
  deleteUserSchema,
  pagination,
  updateUserSchema,
  viewOneUserSchema,
} from "../../../infra/schema/user.schema";
import { createUserController } from "../controllers/user/user.create.controller";
import { deleteUserController } from "../controllers/user/user.delete.controller";
import { findAllUsersController } from "../controllers/user/user.find-many.controller";
import { findOneUserController } from "../controllers/user/user.find-one.controller";
import { updateUserController } from "../controllers/user/user.update.controller";

function userRoutes(app: Express) {
  /**
   * @openapi
   * '/api/users':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post(
    "/api/users",
    validateResource(createUserSchema),
    createUserController
  );

  /**
   * @openapi
   * '/api/users/{userId}':
   *  get:
   *     tags:
   *     - User
   *     summary: Find one User
   *     parameters:
   *      - name: userId
   *        in: path
   *        description: The id of the user
   *        required: true
   *     responses:
   *      200:
   *        description: Success
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.get(
    "/api/users/:userId",
    deserializeUser,
    is(["Admin", "Basic"]),
    validateResource(viewOneUserSchema),
    findOneUserController
  );

  /**
   * @openapi
   * '/api/users':
   *  get:
   *    tags:
   *    - User
   *    summary: Find all users
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
    "/api/users",
    deserializeUser,
    is(["Admin"]),
    [validateResource(pagination)],
    findAllUsersController
  );

  /**
   * @openapi
   * '/api/users/{userId}':
   *  put:
   *     tags:
   *     - User
   *     summary: Update User
   *     parameters:
   *      - name: userId
   *        in: path
   *        description: update user
   *        required: true
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/UpdateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.put(
    "/api/users/:userId",
    deserializeUser,
    is(["Admin"]),
    [validateResource(updateUserSchema)],
    updateUserController
  );

  /**
   * @openapi
   * '/api/users/{userId}':
   *  delete:
   *     tags:
   *     - User
   *     summary: delete one User
   *     parameters:
   *      - name: userId
   *        in: path
   *        description: The id of the user
   *        required: true
   *     responses:
   *      200:
   *        description: Success
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.delete(
    "/api/users/:userId",
    deserializeUser,
    is(["Admin"]),
    [validateResource(deleteUserSchema)],
    deleteUserController
  );
}

export default userRoutes;
