import {
  AssessmentInput,
  AssessmentRepository,
} from "../../../infra/database/db-repositories/assessment.repository";
import { UserRepository } from "../../../infra/database/db-repositories/user.repository";
import { db } from "../../../infra/settings/utils/connect";
import {
  badRequest,
  ok,
  serverError,
} from "../../../infra/settings/utils/helpers";
import { HttpResponse } from "../../../infra/settings/utils/protocols";

export async function createAssessmentService(
  input: AssessmentInput
): Promise<HttpResponse<{ success: boolean }>> {
  try {
    const userRepository = new UserRepository(db);
    const assessmentRepository = new AssessmentRepository(db);
    const user = await userRepository.findOne(String(input.userId));
    if (!user) {
      return badRequest("User not found");
    }
    await assessmentRepository.create(input);
    return ok<boolean>({ success: true });
  } catch (e: any) {
    return serverError("Erro creatind assessment");
  }
}
