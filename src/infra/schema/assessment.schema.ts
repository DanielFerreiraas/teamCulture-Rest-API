import { TypeOf, number, object, string, z } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateAssessmentInput:
 *      type: object
 *      required:
 *        - userId
 *        - rating
 *        - comment
 *      properties:
 *        userId:
 *          type: string
 *          default: 669d1d4bf3544b5aac444eb1
 *        rating:
 *          type: number
 *          default: 5
 *        comment:
 *          type: string
 *          default: Good
 *    UpdateAssessmentInput:
 *      type: object
 *      required:
 *        - rating
 *        - comment
 *      properties:
 *        rating:
 *          type: number
 *          default: 5
 *        comment:
 *          type: string
 *          default: Good
 */

const payload = {
  body: object({
    userId: string({
      required_error: "userId is required",
    }),
    rating: number({
      required_error: "rating is required",
    }).refine((val) => val >= 1 && val <= 5, {
      message: "Rating must be between 1 and 5",
    }),
    comment: string({
      required_error: "Comment is required",
    }),
  }),
};

const params = {
  params: object({
    assessmentId: string({
      required_error: "assessmentId is required",
    }),
  }),
};

const updatePayload = {
  body: object({
    rating: number({
      required_error: "rating is required",
    }).refine((val) => val >= 1 && val <= 5, {
      message: "Rating must be between 1 and 5",
    }),
    comment: string({
      required_error: "Comment is required",
    }),
  }),
};

const paginationSchema = {
  query: object({
    page: z.coerce
      .number({
        required_error: "Page is required",
      })
      .min(1, "Page must be greater than or equal to 1")
      .optional(),
    pageSize: z.coerce
      .number({
        required_error: "Page size is required",
      })
      .min(1, "Page size must be greater than or equal to 1")
      .max(100, "Page size must be less than or equal to 100")
      .optional(),
    rating: z.coerce
      .number()
      .optional()
      .refine((val) => val === undefined || (val >= 1 && val <= 5), {
        message: "Rating must be between 1 and 5",
      }),
    ratingComparison: z.enum(["gt", "lt", "eq"]).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
};

export const pagination = object({ ...paginationSchema });

export const createAssessmentSchema = object({
  ...payload,
});

export const updateAssessmentSchema = object({
  ...updatePayload,
  ...params,
});

export const deleteAssessmentSchema = object({
  ...params,
});

export const viewOneAssessmentSchema = object({
  ...params,
});

export type PaginationInput = TypeOf<typeof pagination>;
export type UpdateAssessmentInput = TypeOf<typeof updateAssessmentSchema>;
export type ViewOneAssessmentInput = TypeOf<typeof viewOneAssessmentSchema>;
export type DeleteAssessmentInput = TypeOf<typeof deleteAssessmentSchema>;
export type CreateAssessmentInput = TypeOf<typeof createAssessmentSchema>;
