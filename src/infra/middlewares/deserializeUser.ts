import { NextFunction, Request, Response } from "express";
import {
  findSessionByTokenService,
  findSessionByUserService,
} from "../../domain/auth/session/services/session.create.domain-service";
import { JWTAdaper } from "../adapters/jwt/jwt.adapter";
import log from "../settings/utils/logger";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token not supplied." });
    }

    const [tokenDecoded, error] = JWTAdaper.verify(token);
    const isLogged = await findSessionByTokenService(token);
    if (error || !isLogged) {
      return res.status(498).json({ message: "Invalid authentication token." });
    }

    const user = await findSessionByUserService(tokenDecoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found based on token provided.",
      });
    }
    next();
  } catch (err) {
    log.error("Error user authenticated:", err);
    return res
      .status(500)
      .json({ message: "Internal server error when authenticating user." });
  }
};

export default deserializeUser;
