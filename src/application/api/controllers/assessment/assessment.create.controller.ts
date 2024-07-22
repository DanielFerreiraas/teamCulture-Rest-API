import { Request, Response } from "express";
import { createAssessmentService } from "../../../../domain/assessment/services/assessment.create.domain-service";
import { CreateAssessmentInput } from "../../../../infra/schema/assessment.schema";

export async function createAssessmentController(
  req: Request<{}, {}, CreateAssessmentInput["body"]>,
  res: Response
) {
  try {
    const assessment = await createAssessmentService(req.body as any);
    return res.status(assessment.statusCode).json(assessment.body);
  } catch (e: any) {
    return res.status(409).send(e.message);
  }
}
