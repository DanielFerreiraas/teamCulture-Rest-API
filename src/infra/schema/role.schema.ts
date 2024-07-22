import { TypeOf, array, object, string, z } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateRoleInput:
 *      type: object
 *      required:
 *        - name
 *        - description
 *        - permissions
 *      properties:
 *        name:
 *          type: string
 *          default: Admin
 *        description:
 *          type: string
 *          default: Administrative role with full permissions
 *        permissions:
 *          type: array
 *          items:
 *            type: string
 *            default: 669e06e0cd48b07794d2f826
 */

const createRolePayload = {
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    description: string({
      required_error: "Description is required",
    }),
    permissions: array(
      string({
        required_error: "Permission is required",
      })
    ).nonempty(),
  }),
};

const updateRolePayload = {
  body: object({
    name: string().optional(),
    description: string().optional(),
    permissions: array(string()).optional(),
  }).partial(),
};

const roleParams = {
  params: object({
    roleId: z.coerce.string({
      required_error: "Role ID is required",
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
  }),
};

export const pagination = object({ ...paginationSchema });

export const createRoleSchema = object({
  ...createRolePayload,
});

export const updateRoleSchema = object({
  ...updateRolePayload,
  ...roleParams,
});

export const deleteRoleSchema = object({
  ...roleParams,
});

export type CreateRoleInput = TypeOf<typeof createRoleSchema>;
export type UpdateRoleInput = TypeOf<typeof updateRoleSchema>;
export type DeleteRoleInput = TypeOf<typeof deleteRoleSchema>;
