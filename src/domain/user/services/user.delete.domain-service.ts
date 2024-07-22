import { UserRepository } from "../../../infra/database/db-repositories/user.repository";
import { db } from "../../../infra/settings/utils/connect";
import {
  notFound,
  ok,
  serverError,
} from "../../../infra/settings/utils/helpers";
import { HttpResponse } from "../../../infra/settings/utils/protocols";

export async function deleteUserService(
  userId: string
): Promise<HttpResponse<{ success: boolean }>> {
  try {
    const userRepository = new UserRepository(db);
    const user = await userRepository.findOne(userId);
    if (!user) {
      return notFound("User not found");
    }
    await userRepository.delete(userId);
    return ok<{ success: boolean }>({
      success: true,
    });
  } catch (error) {
    return serverError("Error delete user");
  }
}
