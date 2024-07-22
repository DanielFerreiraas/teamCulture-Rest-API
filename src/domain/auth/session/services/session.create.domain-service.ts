import { JWTAdaper } from "../../../../infra/adapters/jwt/jwt.adapter";
import {
  Session,
  SessionInput,
  SessionRepository,
} from "../../../../infra/database/db-repositories/session.repository";
import { db } from "../../../../infra/settings/utils/connect";

export async function createSessionService(
  userId: string
): Promise<{ success: boolean; token?: string }> {
  try {
    const sessionRepository = new SessionRepository(db);
    const isLogged = await sessionRepository.findByUserId(userId);
    const accessToken = JWTAdaper.sign({ userId });

    const input: SessionInput = {
      userId,
      token: accessToken,
    };

    if (isLogged) {
      isLogged.token = input.token;
      await sessionRepository.update(isLogged._id as any, input);
      return {
        success: true,
        token: input.token,
      };
    }
    const result = await sessionRepository.create(input);
    if (result) {
      return {
        success: true,
        token: input.token,
      };
    }
    return { success: false };
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findSessionByTokenService(token: string): Promise<{
  success: boolean;
  session?: Session;
}> {
  try {
    const sessionRepository = new SessionRepository(db);
    const session = await sessionRepository.findByToken(token);

    if (session) {
      return { success: true, session };
    }

    return { success: false };
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findSessionByUserService(user: string): Promise<{
  success: boolean;
  session?: Session;
}> {
  try {
    const sessionRepository = new SessionRepository(db);
    const session = await sessionRepository.findByToken(user);

    if (session) {
      return { success: true, session };
    }

    return { success: false };
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findOneSessionByIdService(sessionId: string): Promise<{
  success: boolean;
  session?: Session;
}> {
  try {
    const sessionRepository = new SessionRepository(db);
    const session = await sessionRepository.findOne(sessionId);

    if (session) {
      return { success: true, session };
    }

    return { success: false };
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateSessionService(
  sessionId: string,
  updatedSession: Partial<Session>
): Promise<boolean> {
  try {
    const sessionRepository = new SessionRepository(db);
    const success = await sessionRepository.update(sessionId, updatedSession);
    return success;
  } catch (error) {
    throw new Error("Failed to update session");
  }
}
