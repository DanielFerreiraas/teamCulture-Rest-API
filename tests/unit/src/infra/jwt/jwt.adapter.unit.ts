import { describe, expect, it, jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import { JWTAdaper } from "../../../../../src/infra/adapters/jwt/jwt.adapter";
describe("[JWTAdaper]", () => {
  it("should create a token with method sign and should verify a token with method verify", () => {
    process.env.JWT_SECRET = "any_secret";
    const input = { id: "any_id", email: "any_email" };
    const sut = JWTAdaper.sign(input);

    expect(sut).toBeTruthy();
    expect(typeof sut).toBe("string");

    const [token, error] = JWTAdaper.verify(sut);
    expect(error).toBeNull();
    expect(token).toBeTruthy();
    expect(typeof token).toBe("object");
    expect(token.id).toBe("any_id");
    expect(token.email).toBe("any_email");
  });

  it("should sign throw if JWT_SECRET is not defined", () => {
    const input = { id: "any_id", email: "any_email" };
    delete process.env.JWT_SECRET;
    expect(() => JWTAdaper.sign(input)).toThrowError(
      "JWT Secret not found on environment variables"
    );
  });
  it("should verify throw if JWT_SECRET is not defined", () => {
    process.env.JWT_SECRET = "any_secret";
    const input = { id: "any_id", email: "any_email" };
    const sut = JWTAdaper.sign(input);

    expect(sut).toBeTruthy();
    expect(typeof sut).toBe("string");

    delete process.env.JWT_SECRET;
    expect(() => JWTAdaper.verify(sut)).toThrowError(
      "JWT Secret not found on environment variables"
    );
  });

  it("should throw if verify throw", () => {
    process.env.JWT_SECRET = "any_secret";
    const input = "any_invalid_token";
    jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(JWTAdaper.verify(input)).toEqual([null, new Error()]);
    expect(JWTAdaper.verify(input)[0]).toBeNull();
    expect(JWTAdaper.verify(input)[1].name).toEqual("JsonWebTokenError");
    expect(JWTAdaper.verify(input)[1].message).toEqual("jwt malformed");
  });
});
