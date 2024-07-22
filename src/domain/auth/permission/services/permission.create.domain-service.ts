import { PermissionRepository } from "../../../../infra/database/db-repositories/permission.repository";
import { CreatePermissionInput } from "../../../../infra/schema/permission.schema";
import { db } from "../../../../infra/settings/utils/connect";
import {
  badRequest,
  ok,
  serverError,
} from "../../../../infra/settings/utils/helpers";
import { HttpResponse } from "../../../../infra/settings/utils/protocols";

export async function createPermissionService(
  input: CreatePermissionInput["body"]
): Promise<HttpResponse<{ success: boolean }>> {
  try {
    const permissionRepository = new PermissionRepository(db);
    const name = await permissionRepository.findByName(input.name);
    if (name) {
      return badRequest("Name alread exists");
    }
    await permissionRepository.create(input);
    return ok<boolean>({ success: true });
  } catch (error: any) {
    return serverError("Error creating permission");
  }
}
