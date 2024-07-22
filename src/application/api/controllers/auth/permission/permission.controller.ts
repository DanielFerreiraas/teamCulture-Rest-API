import { Request, Response } from "express";
import { createPermissionService } from "../../../../../domain/auth/permission/services/permission.create.domain-service";
import { CreatePermissionInput } from "../../../../../infra/schema/permission.schema";

export async function createPermissionController(
  req: Request<{}, {}, CreatePermissionInput["body"]>,
  res: Response
) {
  try {
    const result = await createPermissionService(req.body);
    return res.status(result.statusCode).json(result.body);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
}
