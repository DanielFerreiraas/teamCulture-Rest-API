import { Request, Response } from "express";
import { createUserService } from "../../../../domain/user/services/user.create.domain-service";
import { CreateUserInput } from "../../../../infra/schema/user.schema";

export async function createUserController(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUserService(req.body as any);
    return res.status(user.statusCode).json(user.body);
  } catch (e: any) {
    return res.status(409).send(e.message);
  }
}
