import { SignOptions, sign, verify } from "jsonwebtoken";

export class JWTAdaper {
  static sign(payload: Object, options?: SignOptions) {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT Secret not found on environment variables");
    }
    return sign(
      payload,
      process.env.JWT_SECRET,
      options
        ? options
        : {
            expiresIn: 60 * 60 * 24 * 30,
            encoding: "utf-8",
            algorithm: "HS256",
          }
    );
  }
  static verify(token: string): [any, any] {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT Secret not found on environment variables");
    }
    try {
      return [verify(token, process.env.JWT_SECRET), null];
    } catch (error) {
      return [null, error];
    }
  }
}
