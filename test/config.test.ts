import { describe, it, expect } from "vitest";

import { validateConfig } from "../src/config";

describe("config", () => {
  describe("validateConfig", () => {
    it("returns default config if no options provided", () => {
      const config = validateConfig({});
      expect(config).toEqual({
        maxAttempts: 3,
        delay: 100,
        maxDelay: 1000,
        backoffStrategy: "constant",
        jitter: true,
        retryCondition: expect.any(Function),
        onRetry: expect.any(Function),
        onExhausted: expect.any(Function),
        timeout: 0,
      });

      expect(config.retryCondition(new Error())).toBe(true);
      expect(config.onRetry(new Error(), 1)).toBeUndefined();
      expect(config.onExhausted(new Error())).toBeUndefined();
    });

    it("throws if maxAttempts is less than or equal to 0", () => {
      expect(() => validateConfig({ maxAttempts: 0 })).toThrow(
        "maxAttempts must be greater than 0",
      );
    });

    it("throws if delay is less than or equal to 0", () => {
      expect(() => validateConfig({ delay: 0 })).toThrow(
        "delay must be greater than 0",
      );
    });

    it("throws if maxDelay is less than or equal to 0", () => {
      expect(() => validateConfig({ maxDelay: 0 })).toThrow(
        "maxDelay must be greater than 0",
      );
    });

    it("throws if jitter is a number and not between 0 and 1", () => {
      expect(() => validateConfig({ jitter: -1 })).toThrow(
        "jitter must be between 0 and 1",
      );
      expect(() => validateConfig({ jitter: 2 })).toThrow(
        "jitter must be between 0 and 1",
      );
    });

    it("throws if timeout is less than 0", () => {
      expect(() => validateConfig({ timeout: -1 })).toThrow(
        "timeout must be 0 for no timeout, or greater than 0",
      );
    });

    it("returns config with custom options", () => {
      function retryCondition() {
        return false;
      }
      function onRetry() {}
      function onExhausted() {}

      const config = validateConfig({
        maxAttempts: 5,
        delay: 200,
        maxDelay: 2000,
        backoffStrategy: "exponential",
        jitter: 0.5,
        retryCondition,
        onRetry,
        onExhausted,
        timeout: 1000,
      });

      expect(config).toEqual({
        maxAttempts: 5,
        delay: 200,
        maxDelay: 2000,
        backoffStrategy: "exponential",
        jitter: 0.5,
        retryCondition,
        onRetry,
        onExhausted,
        timeout: 1000,
      });
    });
  });
});
