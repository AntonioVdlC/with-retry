import { type RetryConfig, validateConfig } from "./config";
import { calculateDelay } from "./delay";

function createRetryFunction(config: Partial<RetryConfig> = {}) {
  return async function retryFunction<T>(fn: () => Promise<T>): Promise<T> {
    const finalConfig = validateConfig(config);

    let attempt = 1;

    while (true) {
      try {
        if (finalConfig.timeout > 0) {
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(
              () => reject(new RetryTimeoutError("Operation timed out")),
              finalConfig.timeout,
            );
          });
          return await Promise.race([fn(), timeoutPromise]);
        }

        return await fn();
      } catch (error) {
        if (
          attempt >= finalConfig.maxAttempts ||
          !finalConfig.retryCondition(error as Error)
        ) {
          finalConfig.onExhausted(error as Error);
          throw error;
        }

        finalConfig.onRetry(error as Error, attempt);

        const delay = calculateDelay(attempt, finalConfig);
        await new Promise((resolve) => setTimeout(resolve, delay));

        attempt += 1;
      }
    }
  };
}

export function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
): Promise<T> {
  return createRetryFunction(config)(fn);
}

export class RetryTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RetryTimeoutError";
  }
}
