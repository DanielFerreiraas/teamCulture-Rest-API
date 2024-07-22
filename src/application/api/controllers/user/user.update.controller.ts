import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { updateUserService } from "../../../../domain/user/services/user.update.domain-service";

export async function updateUserController(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const updatedUser = req.body;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID");
    }
    delete updatedUser.password;

    const success = await updateUserService(userId, updatedUser);

    if (!success.body.success) {
      return res.status(404).send("User not found");
    }

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
}
