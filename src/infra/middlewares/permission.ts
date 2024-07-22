import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { findSessionByTokenService } from "../../domain/auth/session/services/session.create.domain-service";
import { findOneUserByIdService } from "../../domain/user/services/user.find-one.domain-service";
import { JWTAdaper } from "../adapters/jwt/jwt.adapter";
import { db } from "../settings/utils/connect";
import log from "../settings/utils/logger";

function convertToObjectId(ids: ObjectId[]): ObjectId[] {
  return ids.map((id) => new ObjectId(id));
}

async function getRoles(roleIds: ObjectId[]): Promise<string[]> {
  try {
    if (roleIds.length === 0) {
      return [];
    }

    const roles = await db
      .collection("roles")
      .find({ _id: { $in: roleIds } })
      .toArray();

    if (roles.length === 0) {
      return [];
    }

    return roles.map((role) => role.name);
  } catch (error) {
    log.error("Error fetching roles:", error);
    return [];
  }
}

function is(requiredRoles: string[]) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      return response
        .status(401)
        .json({ message: "Authentication token not supplied." });
    }

    const [tokenDecoded, error] = JWTAdaper.verify(token);
    const isLogged = await findSessionByTokenService(token);
    if (error || !isLogged) {
      return response
        .status(498)
        .json({ message: "Invalid authentication token." });
    }

    const userLogged = await findOneUserByIdService(tokenDecoded.userId);

    if (!userLogged.body.user?._id || !userLogged.body.user.roles) {
      log.info("User roles are undefined or user is not authenticated");
      return response.status(401).json({ message: "Not authorized!" });
    }

    const roleIds = convertToObjectId(userLogged.body.user.roles);

    const userRoles = await getRoles(roleIds);

    const hasRequiredRole = userRoles.some((role) =>
      requiredRoles.includes(role)
    );

    if (hasRequiredRole) {
      return next();
    }

    return response.status(401).json({ message: "Not authorized!" });
  };
}

export { is };
