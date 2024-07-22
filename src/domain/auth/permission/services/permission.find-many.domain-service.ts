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

export async function findAllPermissionService(
  page: number,
  pageSize: number
): Promise<
  HttpResponse<{
    success: boolean;
    data?: { total: number; data: Permission[] };
  }>
> {
  try {
    const permissionRepository = new PermissionRepository(db);
    const permissions = await permissionRepository.findMany(page, pageSize);

    if (permissions) {
      return ok<{
        success: boolean;
        data: { total: number; data: Permission[] };
      }>({
        success: true,
        data: permissions,
      });
    }
    return notFound("assessments not found");
  } catch (error: any) {
    return serverError("Error search assessments");
  }
}
