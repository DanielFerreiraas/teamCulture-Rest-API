import { Request, Response } from "express";
import { findAllAssessmentService } from "../../../../domain/assessment/services/assessment.find-many.domain-service";

export async function findAllAssessmentsController(
  req: Request,
  res: Response
) {
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const rating = req.query.rating
    ? parseInt(req.query.rating as string, 10)
    : undefined;
  const ratingComparison = req.query.ratingComparison as "gt" | "lt";
  const startDate = req.query.startDate
    ? new Date(req.query.startDate as string)
    : undefined;
  const endDate = req.query.endDate
    ? new Date(req.query.endDate as string)
    : undefined;

  if (page < 1 || pageSize < 1) {
    return res
      .status(400)
      .send({ message: "Page and pageSize must be greater than 0" });
  }

  if (rating && (isNaN(rating) || rating < 0)) {
    return res.status(400).send({ message: "Invalid rating value" });
  }

  if (ratingComparison && !["eq", "gt", "lt"].includes(ratingComparison)) {
    return res.status(400).send({ message: "Invalid ratingComparison value" });
  }

  if (startDate && isNaN(startDate.getTime())) {
    return res.status(400).send({ message: "Invalid startDate format" });
  }

  if (endDate && isNaN(endDate.getTime())) {
    return res.status(400).send({ message: "Invalid endDate format" });
  }

  try {
    const result = await findAllAssessmentService(
      page,
      pageSize,
      rating,
      ratingComparison,
      startDate,
      endDate
    );

    if (result.body.success) {
      return res.status(200).json(result.body.data);
    } else {
      return res.status(404).send({ message: "Assessments not found" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
}
