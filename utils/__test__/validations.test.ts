import { describe, it, expect } from "vitest";
import { validateEmail, validatePassword, notEmpty } from "../validations";

describe("validateEmail", () => {
  it("returns error for empty email", () => {
    expect(validateEmail("")).toEqual({
      isValid: false,
      error: "Email is required.",
    });
  });
  it("returns error for invalid email", () => {
    expect(validateEmail("invalid")).toEqual({
      isValid: false,
      error: "Invalid email format.",
    });
  });
  it("returns valid for correct email", () => {
    expect(validateEmail("test@example.com")).toEqual({
      isValid: true,
      error: null,
    });
  });
});

describe("validatePassword", () => {
  it("returns error for empty password", () => {
    expect(validatePassword("")).toEqual({
      isValid: false,
      error: "Password is required.",
    });
  });
  it("returns error for short password", () => {
    expect(validatePassword("123")).toEqual({
      isValid: false,
      error: "Password must be at least 6 characters long.",
    });
  });
  it("returns valid for long enough password", () => {
    expect(validatePassword("123456")).toEqual({ isValid: true, error: null });
  });
});

describe("notEmpty", () => {
  it("returns error message if value is empty", () => {
    expect(notEmpty("", "Field")).toBe("Field is required");
  });
  it("returns empty string if value is not empty", () => {
    expect(notEmpty("something", "Field")).toBe("");
  });
});
