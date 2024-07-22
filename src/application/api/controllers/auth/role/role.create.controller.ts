import { Request, Response } from "express";
import { createRoleService } from "../../../../../domain/auth/role/services/role.create.domain-service";
import { CreateRoleInput } from "../../../../../infra/schema/role.schema";

export async function createRoleController(
  req: Request<{}, {}, CreateRoleInput["body"]>,
  res: Response
) {
  try {
    const result = await createRoleService(req.body);
    return res.status(result.statusCode).json(result.body);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
}
