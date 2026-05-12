import { describe, expect, test } from "@jest/globals";
import { isValidJson } from "../src/util";

describe("util tests", () => {
  describe("isValidJson", () => {
    test("returns true for a JSON object string", () => {
      expect(isValidJson(JSON.stringify({ value: "test value" }))).toBe(true);
    });

    test("returns true for a JSON array string", () => {
      expect(isValidJson(JSON.stringify([1, 2, 3]))).toBe(true);
    });

    test("returns true for a JSON number string", () => {
      expect(isValidJson("42")).toBe(true);
    });

    test("returns true for a JSON null string", () => {
      expect(isValidJson("null")).toBe(true);
    });

    test("returns false for an invalid JSON string", () => {
      expect(isValidJson("invalid json")).toBe(false);
    });

    test("returns false for a plain non-JSON string", () => {
      expect(isValidJson("hello world")).toBe(false);
    });
  });
});
