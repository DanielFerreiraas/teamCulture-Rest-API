import { Request, Response } from "express";
import { findAllUserService } from "../../../../domain/user/services/user.find-many.domain-service";

export async function findAllUsersController(req: Request, res: Response) {
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

  if (page < 1 || pageSize < 1) {
    return res
      .status(400)
      .send({ message: "Page and pageSize must be greater than 0" });
  }

  try {
    const result = await findAllUserService(page, pageSize);

    if (result.body.success) {
      return res.status(200).json(result.body.data);
    } else {
      return res.status(404).send({ message: "Users not found" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
}
