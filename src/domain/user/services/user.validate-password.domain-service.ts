import {
  User,
  UserRepository,
} from "../../../infra/database/db-repositories/user.repository";
import { db } from "../../../infra/settings/utils/connect";
import {
  badRequest,
  ok,
  serverError,
} from "../../../infra/settings/utils/helpers";
import { HttpResponse } from "../../../infra/settings/utils/protocols";

export async function validatePasswordService({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<HttpResponse<{ success: boolean; user?: User }>> {
  try {
    const userRepository = new UserRepository(db);
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return badRequest("User not found");
    }

    const isValid = await userRepository.comparePassword(
      password,
      user.password
    );

    if (!isValid) {
      return badRequest("Invalid password");
    }

    return ok<{ success: boolean; user: User }>({
      success: true,
      user: user,
    });
  } catch (error: any) {
    return serverError("Error validate user");
  }
}
