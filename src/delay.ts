import { type RetryConfig } from "./config";
import { isFunction, isNumber } from "./utils";

export function calculateDelay(attempt: number, config: RetryConfig): number {
  let delay: number;

  if (config.backoffStrategy === "constant") {
    delay = config.delay;
  } else if (config.backoffStrategy === "linear") {
    delay = config.delay * attempt;
  } else if (config.backoffStrategy === "exponential") {
    delay = config.delay * 2 ** attempt;
  } else if (typeof config.backoffStrategy === "object") {
    if (config.backoffStrategy.type === "linear") {
      delay = config.delay * config.backoffStrategy.factor * attempt;
    } else if (config.backoffStrategy.type === "exponential") {
      delay = config.delay * config.backoffStrategy.factor ** attempt;
    } else {
      throw new Error("Invalid backoff strategy");
    }
  } else {
    delay = config.backoffStrategy(attempt, config.delay);
  }

  delay = Math.min(delay, config.maxDelay);

  if (config.jitter) {
    const jitter = isFunction(config.jitter)
      ? config.jitter(attempt, delay)
      : isNumber(config.jitter)
        ? config.jitter
        : Math.random();
    delay = delay + delay * jitter;
  }

  return delay;
}
