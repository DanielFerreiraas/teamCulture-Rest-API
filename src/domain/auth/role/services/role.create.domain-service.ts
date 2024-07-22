import { ObjectId } from "mongodb";
import { RoleRepository } from "../../../../infra/database/db-repositories/role.repository";
import { CreateRoleInput } from "../../../../infra/schema/role.schema";
import { db } from "../../../../infra/settings/utils/connect";
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from "../../../../infra/settings/utils/helpers";
import { HttpResponse } from "../../../../infra/settings/utils/protocols";
import { findManyPermissionsByIdsService } from "../../permission/services/permission.find-array.domain-service";

export async function createRoleService(
  input: CreateRoleInput["body"]
): Promise<HttpResponse<{ success: boolean }>> {
  try {
    const roleRepository = new RoleRepository(db);
    const name = await roleRepository.findByName(input.name);
    if (name) {
      return badRequest("Name alread exists");
    }
    const permissions: ObjectId[] = [];
    for (const permission of input.permissions) {
      if (!ObjectId.isValid(permission)) {
        return badRequest("Invalid permission ID");
      }
      permissions.push(new ObjectId(permission));
    }

    const permissionExists = await findManyPermissionsByIdsService(permissions);
    if (!permissionExists.body.success) {
      return notFound("Permissions not found");
    }

    const role = {
      ...input,
      permissions,
    };
    await roleRepository.create(role);
    return ok<boolean>({ success: true });
  } catch (error: any) {
    return serverError("Error create role");
  }
}
