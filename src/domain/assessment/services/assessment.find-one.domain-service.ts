import {
  Assessment,
  AssessmentRepository,
} from "../../../infra/database/db-repositories/assessment.repository";
import { db } from "../../../infra/settings/utils/connect";
import {
  notFound,
  ok,
  serverError,
} from "../../../infra/settings/utils/helpers";
import { HttpResponse } from "../../../infra/settings/utils/protocols";

export async function findOneAssessmentByIdService(
  assessmentId: string
): Promise<HttpResponse<{ success: boolean; assessment?: Assessment }>> {
  try {
    const assessmentRepository = new AssessmentRepository(db);
    const assessment = await assessmentRepository.findOne(assessmentId);

    if (!assessment) {
      return notFound("assessment not found");
    }

    return ok<{ success: boolean; assessment: Assessment }>({
      success: true,
      assessment: assessment,
    });
  } catch (error: any) {
    return serverError("Error search assessment");
  }
}
