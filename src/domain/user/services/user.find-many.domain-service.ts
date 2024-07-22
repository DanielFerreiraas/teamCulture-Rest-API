import {
  User,
  UserRepository,
} from "../../../infra/database/db-repositories/user.repository";
import { db } from "../../../infra/settings/utils/connect";
import {
  notFound,
  ok,
  serverError,
} from "../../../infra/settings/utils/helpers";
import { HttpResponse } from "../../../infra/settings/utils/protocols";

export async function findAllUserService(
  page: number,
  pageSize: number
): Promise<
  HttpResponse<{
    success: boolean;
    data?: { total: number; data: User[] };
  }>
> {
  try {
    const userRepository = new UserRepository(db);
    const users = await userRepository.findMany(page, pageSize);

    if (users) {
      return ok<{
        success: boolean;
        data: { total: number; data: User[] };
      }>({
        success: true,
        data: users,
      });
    }
    return notFound("users not found");
  } catch (error: any) {
    return serverError("Error search user");
  }
}
