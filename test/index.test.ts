import { describe, it, expect } from "vitest";

import { withRetry, RetryTimeoutError } from "../src/index";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("withRetry", () => {
  it("retries until successful", async () => {
    let attempts = 0;

    const result = await withRetry<string>(() => {
      attempts += 1;
      if (attempts < 3) {
        throw new Error("Failed");
      }

      return new Promise((resolve) => resolve("Success"));
    });

    expect(result).toBe("Success");
    expect(attempts).toBe(3);
  });

  it("retries until successful with custom config", async () => {
    let attempts = 0;
    const maxAttempts = 5;

    const result = await withRetry<string>(
      () => {
        attempts += 1;
        if (attempts < maxAttempts) {
          throw new Error("Failed");
        }

        return new Promise((resolve) => resolve("Success"));
      },
      { maxAttempts },
    );

    expect(result).toBe("Success");
    expect(attempts).toBe(maxAttempts);
  });

  it("retries until successful with timeout", async () => {
    let attempts = 0;

    const result = await withRetry<string>(
      async () => {
        attempts += 1;
        if (attempts < 3) {
          await sleep(200);
        }

        return new Promise((resolve) => resolve("Success"));
      },
      { timeout: 100 },
    );

    expect(result).toBe("Success");
    expect(attempts).toBe(3);
  });

  it("retries until successful with timeout and throws RetryTimeoutError", async () => {
    let attempts = 0;
    const maxAttempts = 3;

    try {
      await withRetry(
        () => {
          attempts += 1;
          return sleep(200);
        },
        { timeout: 100, maxAttempts },
      );
    } catch (error) {
      expect(error).toBeInstanceOf(RetryTimeoutError);
    }

    expect(attempts).toBe(maxAttempts);
  });

  it("retries until successful with custom retry condition", async () => {
    let attempts = 0;

    const result = await withRetry<string>(
      () => {
        attempts += 1;
        if (attempts < 3) {
          throw new Error("Failed");
        }

        return new Promise((resolve) => resolve("Success"));
      },
      {
        retryCondition: (error) => error.message === "Failed",
      },
    );

    expect(result).toBe("Success");
    expect(attempts).toBe(3);
  });

  it("retries until successful with custom retry condition and throws on exhausted", async () => {
    let attempts = 0;
    const maxAttempts = 3;

    try {
      await withRetry(
        () => {
          attempts += 1;
          throw new Error("Failed");
        },
        {
          retryCondition: (error) => error.message === "Failed",
          onExhausted: (error) => {
            throw error;
          },
        },
      );
    } catch (error) {
      expect(error.message).toBe("Failed");
    }

    expect(attempts).toBe(maxAttempts);
  });

  it("retries until successful with custom backoff strategy", async () => {
    let attempts = 0;

    const result = await withRetry<string>(
      () => {
        attempts += 1;
        if (attempts < 3) {
          throw new Error("Failed");
        }

        return new Promise((resolve) => resolve("Success"));
      },
      {
        backoffStrategy: "exponential",
        delay: 100,
      },
    );

    expect(result).toBe("Success");
    expect(attempts).toBe(3);
  });

  it("retries until successful with custom jitter", async () => {
    let attempts = 0;

    const result = await withRetry<string>(
      () => {
        attempts += 1;
        if (attempts < 3) {
          throw new Error("Failed");
        }

        return new Promise((resolve) => resolve("Success"));
      },
      {
        jitter: 0.5,
      },
    );

    expect(result).toBe("Success");
    expect(attempts).toBe(3);
  });

  it("retries until successful with custom onRetry", async () => {
    let attempts = 0;

    const result = await withRetry<string>(
      () => {
        attempts += 1;
        if (attempts < 3) {
          throw new Error("Failed");
        }

        return new Promise((resolve) => resolve("Success"));
      },
      {
        onRetry: (error, attempt) => {
          expect(error.message).toBe("Failed");
          expect(attempt).toBe(attempts);
        },
      },
    );

    expect(result).toBe("Success");
    expect(attempts).toBe(3);
  });

  it("retries until successful with custom onExhausted", async () => {
    let attempts = 0;

    try {
      await withRetry(
        () => {
          attempts += 1;
          throw new Error("Failed");
        },
        {
          onExhausted: (error) => {
            throw error;
          },
        },
      );
    } catch (error) {
      expect(error.message).toBe("Failed");
    }

    expect(attempts).toBe(3);
  });

  it("retries until successful with custom delay", async () => {
    let attempts = 0;

    const result = await withRetry<string>(
      () => {
        attempts += 1;
        if (attempts < 3) {
          throw new Error("Failed");
        }

        return new Promise((resolve) => resolve("Success"));
      },
      {
        delay: 200,
      },
    );

    expect(result).toBe("Success");
    expect(attempts).toBe(3);
  });

  it("retries until successful with custom maxDelay", async () => {
    let attempts = 0;

    const result = await withRetry<string>(
      () => {
        attempts += 1;
        if (attempts < 3) {
          throw new Error("Failed");
        }

        return new Promise((resolve) => resolve("Success"));
      },
      {
        maxDelay: 200,
      },
    );

    expect(result).toBe("Success");
    expect(attempts).toBe(3);
  });

  it("retries until successful with custom maxAttempts", async () => {
    let attempts = 0;

    const result = await withRetry<string>(
      () => {
        attempts += 1;
        if (attempts < 5) {
          throw new Error("Failed");
        }

        return new Promise((resolve) => resolve("Success"));
      },
      {
        maxAttempts: 5,
      },
    );

    expect(result).toBe("Success");
    expect(attempts).toBe(5);
  });
});
