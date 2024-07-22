import { ObjectId } from "mongodb";
import {
  Permission,
  PermissionRepository,
} from "../../../../infra/database/db-repositories/permission.repository";
import { db } from "../../../../infra/settings/utils/connect";
import {
  notFound,
  ok,
  serverError,
} from "../../../../infra/settings/utils/helpers";
import { HttpResponse } from "../../../../infra/settings/utils/protocols";

export async function findManyPermissionsByIdsService(
  permissionIds: ObjectId[]
): Promise<HttpResponse<{ success: boolean; permissions?: Permission[] }>> {
  try {
    const permissionRepository = new PermissionRepository(db);
    const objectIds = permissionIds.map((id) => new ObjectId(id));
    const permissions = await permissionRepository.findByIds(objectIds);

    if (!permissions || permissions.length === 0) {
      return notFound("Permissions not found");
    }

    return ok<{ success: boolean; permissions: Permission[] }>({
      success: true,
      permissions: permissions,
    });
  } catch (error: any) {
    return serverError("Error search assessments");
  }
}
