import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { deleteUserService } from "../../../../domain/user/services/user.delete.domain-service";

export async function deleteUserController(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID");
    }
    const success = await deleteUserService(userId);

    if (!success.body.success) {
      return res.status(404).send("User not found");
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
}
