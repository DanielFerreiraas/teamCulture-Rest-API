import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { findOneUserByIdService } from "../../../../domain/user/services/user.find-one.domain-service";
import { ViewOneUserInput } from "../../../../infra/schema/user.schema";

export async function findOneUserController(
  req: Request<ViewOneUserInput["params"]>,
  res: Response
) {
  try {
    const userId = req.params.userId;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID");
    }

    const user = await findOneUserByIdService(userId);

    if (!user.body.success) {
      return res.status(404).send("User not found");
    }

    return res.status(user.statusCode).json(user.body);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
}
