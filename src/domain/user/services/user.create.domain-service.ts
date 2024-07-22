import { ObjectId } from "mongodb";
import {
  UserInput,
  UserRepository,
} from "../../../infra/database/db-repositories/user.repository";

import { db } from "../../../infra/settings/utils/connect";
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from "../../../infra/settings/utils/helpers";
import { HttpResponse } from "../../../infra/settings/utils/protocols";
import { findManyRolesByIdsService } from "../../auth/role/services/role.find-array.domain-service";

export async function createUserService(
  input: UserInput
): Promise<HttpResponse<{ success: boolean }>> {
  try {
    const userRepository = new UserRepository(db);
    const email = await userRepository.findByEmail(input.email);
    if (email) {
      return badRequest("E-mail alread exists");
    }

    const roles: ObjectId[] = [];
    for (const role of input.roles!) {
      if (!ObjectId.isValid(role)) {
        return badRequest("Invalid role ID");
      }
      roles.push(new ObjectId(role));
    }

    const roleExists = await findManyRolesByIdsService(roles);

    if (roleExists.body.success != true) {
      return notFound("Role not found");
    }

    await userRepository.create(input);
    return ok<boolean>({ success: true });
  } catch (error: any) {
    return serverError("Error creating user");
  }
}
