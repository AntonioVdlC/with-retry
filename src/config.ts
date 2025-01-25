import { isNumber } from "./utils";

type RetryConfigBackoffStrategy =
  | "constant"
  | "linear"
  | "exponential"
  | { type: "linear"; factor: number }
  | { type: "exponential"; factor: number }
  | ((attempt: number, delay: number) => number);

type RetryConfigJitter =
  | boolean
  | number
  | ((attempt: number, delay: number) => number);

export type RetryConfig = {
  maxAttempts: number;
  delay: number;
  maxDelay: number;
  backoffStrategy: RetryConfigBackoffStrategy;
  jitter: RetryConfigJitter;
  retryCondition: (error: Error) => boolean;
  onRetry: (error: Error, attempt: number) => void;
  onExhausted: (error: Error) => void;
  timeout: number;
};

const DEFAULT_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delay: 100,
  maxDelay: 1000,
  backoffStrategy: "constant",
  jitter: true,
  retryCondition: () => true,
  onRetry: () => {},
  onExhausted: () => {},
  timeout: 0,
};

export function validateConfig(config: Partial<RetryConfig>): RetryConfig {
  if (config.maxAttempts !== undefined && config.maxAttempts <= 0) {
    throw new Error("maxAttempts must be greater than 0");
  }

  if (config.delay !== undefined && config.delay <= 0) {
    throw new Error("delay must be greater than 0");
  }

  if (config.maxDelay !== undefined && config.maxDelay <= 0) {
    throw new Error("maxDelay must be greater than 0");
  }

  if (
    config.jitter !== undefined &&
    isNumber(config.jitter) &&
    (config.jitter < 0 || config.jitter > 1)
  ) {
    throw new Error("jitter must be between 0 and 1");
  }

  if (config.timeout !== undefined && config.timeout < 0) {
    throw new Error("timeout must be 0 for no timeout, or greater than 0");
  }

  return { ...DEFAULT_CONFIG, ...config };
}
