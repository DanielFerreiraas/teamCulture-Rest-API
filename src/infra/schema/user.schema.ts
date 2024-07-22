import { array, object, string, TypeOf, z } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        password:
 *          type: string
 *          default: admin123
 *        roles:
 *          type: array
 *          items:
 *            type: string
 *            default: 669e06e0cd48b07794d2f826
 *    UpdateUserInput:
 *      type: object
 *      required:
 *        - userId
 *      properties:
 *        name:
 *          type: string
 *          default: Jane Doe
 *        roles:
 *          type: array
 *          items:
 *            type: string
 *            default: 669e06e0cd48b07794d2f826
 */

const createUserPayload = {
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    roles: array(
      string({
        required_error: "role is required",
      })
    ).nonempty(),
  }),
};

const updateUserPayload = {
  body: object({
    name: string().optional(),
  }),
};

const userParams = {
  params: object({
    userId: z.coerce.string({
      required_error: "userId is required",
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

export const createUserSchema = object({
  ...createUserPayload,
});

export const updateUserSchema = object({
  ...updateUserPayload,
  ...userParams,
});

export const deleteUserSchema = object({
  ...userParams,
});

export const viewOneUserSchema = object({
  ...userParams,
});

export type PaginationInput = TypeOf<typeof pagination>;
export type CreateUserInput = TypeOf<typeof createUserSchema>;
export type UpdateUserInput = TypeOf<typeof updateUserSchema>;
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>;
export type ViewOneUserInput = TypeOf<typeof viewOneUserSchema>;
