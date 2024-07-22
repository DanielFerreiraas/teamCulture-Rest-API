import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { deleteAssessmentService } from "../../../../domain/assessment/services/assessment.delete.domain-service";

export async function deleteAssessmentController(
  req: Request<{ assessmentId: string }>,
  res: Response
) {
  try {
    const assessmentId = req.params.assessmentId;
    if (!ObjectId.isValid(assessmentId)) {
      return res.status(400).send("Invalid assessment ID");
    }

    const success = await deleteAssessmentService(assessmentId);

    if (!success.body.success) {
      return res.status(404).send("Assessment not found");
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
}
