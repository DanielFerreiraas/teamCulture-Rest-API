import { Request, Response } from "express";
import { createSessionService } from "../../../../../domain/auth/session/services/session.create.domain-service";

import { validatePasswordService } from "../../../../../domain/user/services/user.validate-password.domain-service";

export async function createUserSessionController(req: Request, res: Response) {
  try {
    const userResult = await validatePasswordService(req.body);

    if (!userResult.body.user || !userResult.body.user) {
      return res.status(400).send("Invalid email or password");
    }

    const user = userResult.body.user;

    const sessionResult = await createSessionService(String(user._id!));

    if (!sessionResult) {
      return res.status(400).send("Erro ao criar sessão");
    }
    return res.send({ success: true, token: sessionResult.token });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
}
