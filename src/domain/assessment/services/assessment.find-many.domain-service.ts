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

export async function findAllAssessmentService(
  page: number,
  pageSize: number,
  rating?: number,
  ratingComparison?: "gt" | "lt" | "eq",
  startDate?: Date,
  endDate?: Date
): Promise<
  HttpResponse<{
    success: boolean;
    data?: { total: number; data: Assessment[] };
  }>
> {
  try {
    const assessmentRepository = new AssessmentRepository(db);
    const assessments = await assessmentRepository.findMany(
      page,
      pageSize,
      rating,
      ratingComparison,
      startDate,
      endDate
    );

    if (assessments) {
      return ok<{
        success: boolean;
        data: { total: number; data: Assessment[] };
      }>({
        success: true,
        data: assessments,
      });
    } else {
      return notFound("assessment not found");
    }
  } catch (error) {
    return serverError("Error search assessment");
  }
}
