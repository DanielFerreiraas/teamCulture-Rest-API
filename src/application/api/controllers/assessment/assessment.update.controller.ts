import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { updateAssessmentService } from "../../../../domain/assessment/services/assessment.update.domain-service";
import { Assessment } from "../../../../infra/database/db-repositories/assessment.repository";

export async function updateAssessmentController(
  req: Request<{ assessmentId: string }, {}, Partial<Assessment>>,
  res: Response
) {
  try {
    const assessmentId = req.params.assessmentId;
    const updatedAssessment = req.body;
    if (!ObjectId.isValid(assessmentId)) {
      return res.status(400).send("Invalid assessment ID");
    }

    const success = await updateAssessmentService(
      assessmentId,
      updatedAssessment
    );

    if (!success.body.success) {
      return res.status(404).send("Assessment not found");
    }

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
}
