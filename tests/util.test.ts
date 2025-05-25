import { describe, expect, test } from "@jest/globals";
import { isValidJson } from "../src/util";

describe("util tests", () => {
  describe("isValidJson test", () => {
    test("returns true for valid JSON string", () => {
      const input = JSON.stringify({ value: "test value" });
      const result = isValidJson(input);
      expect(result).toBeTruthy();
    });

    test("returns false for valid JSON string", () => {
      const input = "invalid json";
      const result = isValidJson(input);
      expect(result).toBeFalsy();
    });
  });
});
