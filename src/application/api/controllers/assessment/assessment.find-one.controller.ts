import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { findOneAssessmentByIdService } from "../../../../domain/assessment/services/assessment.find-one.domain-service";

export async function findOneAssessmentController(
  req: Request<{ assessmentId: string }>,
  res: Response
) {
  try {
    const assessmentId = req.params.assessmentId;
    if (!ObjectId.isValid(assessmentId)) {
      return res.status(400).send("Invalid assessment ID");
    }

    const assessment = await findOneAssessmentByIdService(assessmentId);

    if (!assessment.body.success) {
      return res.status(404).send("Assessment not found");
    }

    return res.status(assessment.statusCode).json(assessment.body);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
}
