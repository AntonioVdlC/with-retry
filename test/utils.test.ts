import { describe, it, expect } from "vitest";

import { isNumber, isFunction } from "../src/utils";

describe("utils", () => {
  describe("isNumber", () => {
    it.each([1, 0, -1, 1.1, -1.1])("returns true for number %s", (value) => {
      expect(isNumber(value)).toBe(true);
    });

    it.each(["1", null, undefined, {}, [], NaN, Infinity])(
      "returns false for non-number %s",
      (value) => {
        expect(isNumber(value)).toBe(false);
      },
    );
  });

  describe("isFunction", () => {
    it.each([() => {}, function () {}, function named() {}, class {}])(
      "returns true for function %s",
      (value) => {
        expect(isFunction(value)).toBe(true);
      },
    );

    it.each([1, "1", null, undefined, {}, []])(
      "returns false for non-function %s",
      (value) => {
        expect(isFunction(value)).toBe(false);
      },
    );
  });
});
