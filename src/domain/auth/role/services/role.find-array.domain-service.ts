import { ObjectId } from "mongodb";
import {
  Role,
  RoleRepository,
} from "../../../../infra/database/db-repositories/role.repository";
import { db } from "../../../../infra/settings/utils/connect";
import {
  notFound,
  ok,
  serverError,
} from "../../../../infra/settings/utils/helpers";
import { HttpResponse } from "../../../../infra/settings/utils/protocols";

export async function findManyRolesByIdsService(
  roleIds: ObjectId[]
): Promise<HttpResponse<{ success: boolean; roles?: Role[] }>> {
  try {
    const roleRepository = new RoleRepository(db);
    const objectIds = roleIds.map((id) => new ObjectId(id));
    const roles = await roleRepository.findByIds(objectIds);

    if (!roles || roles.length !== objectIds.length) {
      return notFound("Roles not found");
    }

    return ok<{ success: boolean; roles: Role[] }>({
      success: true,
      roles: roles,
    });
  } catch (error: any) {
    return serverError("Error search roles");
  }
}
