import { Express } from "express";
import validateResource from "../../../infra/middlewares/validateResource";
import { createSessionSchema } from "../../../infra/schema/session.schema";
import { createUserSessionController } from "../controllers/auth/session/session.controller";

function sessionRoutes(app: Express) {
  /**
   * @openapi
   * '/api/sessions':
   *  post:
   *     tags:
   *     - Session
   *     summary: Signin
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateSessionInput'
   *     responses:
   *      200:
   *        description: Success
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createUserSessionController
  );
}

export default sessionRoutes;
