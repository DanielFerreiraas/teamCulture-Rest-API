import { describe, expect, it } from "@jest/globals";
import { PasswordFacade } from "../../../../../../src/infra/adapters/hashPassword/bcrypt/hash-password.adapter";

describe("Hash Password Facade", () => {
  it("should hash a password", () => {
    const input = "any_password";
    const hashedPassword = PasswordFacade.hash(input);
    expect(hashedPassword).not.toBe(input);
    expect(hashedPassword).toBeTruthy();
  });

  it("should compare a hash with password correctly", () => {
    const password = "any_password";
    const hashedPassword = PasswordFacade.hash(password);
    expect(hashedPassword).not.toBe(password);

    const isMatch = PasswordFacade.compare(password, hashedPassword);
    expect(isMatch).toBeTruthy();
  });

  it("should return false if hash is invalid", () => {
    const password = "any_password";
    const invalidHash = "invalid_hash";

    const isMatch = PasswordFacade.compare(password, invalidHash);
    expect(isMatch).toBeFalsy();
  });

  it("should handle empty password strings", () => {
    const emptyPassword = "";
    const hashedPassword = PasswordFacade.hash(emptyPassword);
    expect(hashedPassword).not.toBe(emptyPassword);
    expect(hashedPassword).toBeTruthy();

    const isMatch = PasswordFacade.compare(emptyPassword, hashedPassword);
    expect(isMatch).toBeTruthy();
  });

  it("should handle long password strings", () => {
    const longPassword = "a".repeat(1000);
    const hashedPassword = PasswordFacade.hash(longPassword);
    expect(hashedPassword).not.toBe(longPassword);
    expect(hashedPassword).toBeTruthy();

    const isMatch = PasswordFacade.compare(longPassword, hashedPassword);
    expect(isMatch).toBeTruthy();
  });

  it("should handle different password hashes", () => {
    const password1 = "password1";
    const password2 = "password2";

    const hash1 = PasswordFacade.hash(password1);
    const hash2 = PasswordFacade.hash(password2);

    expect(hash1).not.toBe(hash2);

    const isMatch1 = PasswordFacade.compare(password1, hash1);
    const isMatch2 = PasswordFacade.compare(password2, hash2);

    expect(isMatch1).toBeTruthy();
    expect(isMatch2).toBeTruthy();
    expect(PasswordFacade.compare(password1, hash2)).toBeFalsy();
    expect(PasswordFacade.compare(password2, hash1)).toBeFalsy();
  });

  it("should handle cases with null or undefined values", () => {
    expect(() => PasswordFacade.hash(null as any)).toThrow();
    expect(() => PasswordFacade.hash(undefined as any)).toThrow();

    expect(() => PasswordFacade.compare(null as any, "hash")).toThrow();
    expect(() => PasswordFacade.compare("password", null as any)).toThrow();
    expect(() => PasswordFacade.compare(null as any, null as any)).toThrow();
  });
});
