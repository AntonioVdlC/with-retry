import { describe, it, expect } from "vitest";

import { calculateDelay } from "../src/delay";

import { validateConfig } from "../src/config";

describe("delay", () => {
  describe("calculateDelay", () => {
    it("throws for invalid config", () => {
      const config = validateConfig({
        delay: 100,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        backoffStrategy: {} as any,
        jitter: false,
      });
      expect(() => calculateDelay(1, config)).toThrow(
        "Invalid backoff strategy",
      );
    });

    it("calculates constant delay", () => {
      const config = validateConfig({
        delay: 100,
        backoffStrategy: "constant",
        jitter: false,
      });
      const delay = calculateDelay(1, config);
      expect(delay).toBe(100);
    });

    it("calculates linear delay", () => {
      const config = validateConfig({
        delay: 100,
        backoffStrategy: "linear",
        jitter: false,
      });
      const delay = calculateDelay(1, config);
      expect(delay).toBe(100);
    });

    it("calculates exponential delay", () => {
      const config = validateConfig({
        delay: 100,
        backoffStrategy: "exponential",
        jitter: false,
      });
      const delay = calculateDelay(1, config);
      expect(delay).toBe(200);
    });

    it("calculates linear delay with factor", () => {
      const config = validateConfig({
        delay: 100,
        backoffStrategy: { type: "linear", factor: 2 },
        jitter: false,
      });
      const delay = calculateDelay(1, config);
      expect(delay).toBe(200);
    });

    it("calculates exponential delay with factor", () => {
      const config = validateConfig({
        delay: 100,
        backoffStrategy: { type: "exponential", factor: 2 },
        jitter: false,
      });
      const delay = calculateDelay(1, config);
      expect(delay).toBe(200);
    });

    it("calculates custom delay", () => {
      const config = validateConfig({
        delay: 100,
        backoffStrategy: (attempt, delay) => attempt * delay,
        jitter: false,
      });
      const delay = calculateDelay(1, config);
      expect(delay).toBe(100);
    });

    it("calculates max delay", () => {
      const config = validateConfig({
        delay: 100,
        backoffStrategy: "linear",
        maxDelay: 200,
        jitter: false,
      });
      const delay = calculateDelay(10, config);
      expect(delay).toBe(200);
    });

    it("calculates delay with jitter", () => {
      const config = validateConfig({
        delay: 100,
        backoffStrategy: "constant",
        jitter: true,
      });
      const delay = calculateDelay(1, config);
      expect(delay).toBeGreaterThanOrEqual(100);
      expect(delay).toBeLessThanOrEqual(200);
    });

    it("calculates delay with constant jitter", () => {
      const config = validateConfig({
        delay: 100,
        backoffStrategy: "constant",
        jitter: 0.1,
      });
      const delay = calculateDelay(1, config);
      expect(delay).toBeGreaterThanOrEqual(100);
      expect(delay).toBeLessThanOrEqual(110);
    });

    it("calculates delay with custom jitter", () => {
      const config = validateConfig({
        delay: 100,
        backoffStrategy: "constant",
        jitter: (attempt) => 0.1 * attempt,
      });
      const delay = calculateDelay(2, config);
      expect(delay).toBeGreaterThanOrEqual(100);
      expect(delay).toBeLessThanOrEqual(120);
    });
  });
});
