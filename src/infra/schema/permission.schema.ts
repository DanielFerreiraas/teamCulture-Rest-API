import { object, string, TypeOf, z } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreatePermissionInput:
 *      type: object
 *      required:
 *        - name
 *        - description
 *      properties:
 *        name:
 *          type: string
 *          default: Manage Users
 *        description:
 *          type: string
 *          default: Allows managing users
 */

const createPermissionPayload = {
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    description: string({
      required_error: "Description is required",
    }),
  }),
};

const updatePermissionPayload = {
  body: object({
    name: string().optional(),
    description: string().optional(),
  }).partial(),
};

const permissionParams = {
  params: object({
    permissionId: z.coerce.string({
      required_error: "Permission ID is required",
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

export const createPermissionSchema = object({
  ...createPermissionPayload,
});

export const updatePermissionSchema = object({
  ...updatePermissionPayload,
  ...permissionParams,
});

export const deletePermissionSchema = object({
  ...permissionParams,
});

export type CreatePermissionInput = TypeOf<typeof createPermissionSchema>;
export type UpdatePermissionInput = TypeOf<typeof updatePermissionSchema>;
export type DeletePermissionInput = TypeOf<typeof deletePermissionSchema>;
