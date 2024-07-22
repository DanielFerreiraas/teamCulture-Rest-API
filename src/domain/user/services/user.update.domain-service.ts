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

export async function updateUserService(
  userId: string,
  updatedUser: Partial<User>
): Promise<HttpResponse<{ success: boolean }>> {
  try {
    const userRepository = new UserRepository(db);
    const user = await userRepository.findOne(userId);
    if (!user) {
      return notFound("User not found");
    }
    await userRepository.update(userId, updatedUser);
    return ok<{ success: boolean }>({
      success: true,
    });
  } catch (error) {
    return serverError("Error update user");
  }
}
