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

export async function findUserByEmailService(
  query: Partial<User>
): Promise<HttpResponse<{ success: boolean; user?: User }>> {
  try {
    const userRepository = new UserRepository(db);
    const user = await userRepository.findByEmail(query.email!);
    if (user) {
      return ok<{ success: boolean; user: User }>({
        success: true,
        user: user,
      });
    }
    return notFound("User not found");
  } catch (error: any) {
    return serverError("Error search user");
  }
}
