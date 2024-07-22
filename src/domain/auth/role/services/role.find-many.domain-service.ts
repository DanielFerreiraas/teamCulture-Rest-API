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

export async function findAllRoleService(
  page: number,
  pageSize: number
): Promise<
  HttpResponse<{
    success: boolean;
    data?: { total: number; data: Role[] };
  }>
> {
  try {
    const roleRepository = new RoleRepository(db);
    const roles = await roleRepository.findMany(page, pageSize);

    if (roles) {
      return ok<{
        success: boolean;
        data: { total: number; data: Role[] };
      }>({
        success: true,
        data: roles,
      });
    }
    return notFound("roles not found");
  } catch (error: any) {
    return serverError("Error search roles");
  }
}
