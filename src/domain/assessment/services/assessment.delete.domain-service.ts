import { AssessmentRepository } from "../../../infra/database/db-repositories/assessment.repository";
import { db } from "../../../infra/settings/utils/connect";
import {
  notFound,
  ok,
  serverError,
} from "../../../infra/settings/utils/helpers";
import { HttpResponse } from "../../../infra/settings/utils/protocols";

export async function deleteAssessmentService(
  assessmentId: string
): Promise<HttpResponse<{ success: boolean }>> {
  try {
    const assessmentRepository = new AssessmentRepository(db);
    const assessment = await assessmentRepository.findOne(assessmentId);
    if (!assessment) {
      return notFound("assessment not found");
    }
    await assessmentRepository.delete(assessmentId);
    return ok<{ success: boolean }>({
      success: true,
    });
  } catch (error) {
    return serverError("Error delete assessment");
  }
}
