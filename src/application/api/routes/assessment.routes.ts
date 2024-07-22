import { Express } from "express";
import deserializeUser from "../../../infra/middlewares/deserializeUser";
import { is } from "../../../infra/middlewares/permission";
import validateResource from "../../../infra/middlewares/validateResource";
import {
  createAssessmentSchema,
  deleteAssessmentSchema,
  pagination,
  updateAssessmentSchema,
  viewOneAssessmentSchema,
} from "../../../infra/schema/assessment.schema";
import { createAssessmentController } from "../controllers/assessment/assessment.create.controller";
import { deleteAssessmentController } from "../controllers/assessment/assessment.delete.controller";
import { findAllAssessmentsController } from "../controllers/assessment/assessment.find-many.controller";
import { findOneAssessmentController } from "../controllers/assessment/assessment.find-one.controller";
import { updateAssessmentController } from "../controllers/assessment/assessment.update.controller";

function assessmentRoutes(app: Express) {
  /**
   * @openapi
   * '/api/assessments':
   *  post:
   *     tags:
   *     - Assessment
   *     summary: Register a assessment
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateAssessmentInput'
   *     responses:
   *      200:
   *        description: Success
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post(
    "/api/assessments",
    deserializeUser,
    is(["Admin", "Basic"]),
    validateResource(createAssessmentSchema),
    createAssessmentController
  );

  /**
   * @openapi
   * '/api/assessments/{assessmentId}':
   *  get:
   *     tags:
   *     - Assessment
   *     summary: Find one Assessment
   *     parameters:
   *      - name: assessmentId
   *        in: path
   *        description: The id of the assessment
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
    "/api/assessments/:assessmentId",
    deserializeUser,
    is(["Admin", "Basic"]),
    validateResource(viewOneAssessmentSchema),
    findOneAssessmentController
  );

  /**
   * @openapi
   * '/api/assessments':
   *  get:
   *    tags:
   *      - Assessment
   *    summary: Find all Assessments
   *    parameters:
   *      - name: page
   *        in: query
   *        description: Page number for pagination
   *        required: false
   *        schema:
   *          type: integer
   *          example: 1
   *      - name: pageSize
   *        in: query
   *        description: Number of records per page
   *        required: false
   *        schema:
   *          type: integer
   *          example: 10
   *      - name: rating
   *        in: query
   *        description: Filter by rating value
   *        required: false
   *        schema:
   *          type: integer
   *      - name: ratingComparison
   *        in: query
   *        description: Comparison operator for rating ('eq' for equal, 'gt' for greater than, 'lt' for less than)
   *        required: false
   *        schema:
   *          type: string
   *          enum: ['eq', 'gt', 'lt']
   *          example: 'eq'
   *      - name: startDate
   *        in: query
   *        description: Filter records created on or after this date (ISO 8601 format)
   *        required: false
   *        schema:
   *          type: string
   *          format: date
   *      - name: endDate
   *        in: query
   *        description: Filter records created on or before this date (ISO 8601 format)
   *        required: false
   *        schema:
   *          type: string
   *          format: date
   *    responses:
   *      200:
   *        description: Success
   *      400:
   *        description: Bad request
   *      404:
   *        description: Not found
   *      500:
   *        description: Internal server error
   */

  app.get(
    "/api/assessments",
    deserializeUser,
    is(["Admin", "Basic"]),
    validateResource(pagination),
    findAllAssessmentsController
  );

  /**
   * @openapi
   * '/api/assessments/{assessmentId}':
   *  put:
   *     tags:
   *     - Assessment
   *     summary: Update Assessment
   *     parameters:
   *      - name: assessmentId
   *        in: path
   *        description: update assessment
   *        required: true
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/UpdateAssessmentInput'
   *     responses:
   *      200:
   *        description: Success
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.put(
    "/api/assessments/:assessmentId",
    deserializeUser,
    is(["Admin", "Basic"]),
    [validateResource(updateAssessmentSchema)],
    updateAssessmentController
  );

  /**
   * @openapi
   * '/api/assessments/{assessmentId}':
   *  delete:
   *     tags:
   *     - Assessment
   *     summary: delete one Assessment
   *     parameters:
   *      - name: assessmentId
   *        in: path
   *        description: The id of the assessment
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
    "/api/assessments/:assessmentId",
    deserializeUser,
    is(["Admin", "Basic"]),
    [validateResource(deleteAssessmentSchema)],
    deleteAssessmentController
  );
}

export default assessmentRoutes;
