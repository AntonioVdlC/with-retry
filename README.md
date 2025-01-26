# with-retry

[![version](https://img.shields.io/npm/v/with-retry.svg)](http://npm.im/with-retry)
[![issues](https://img.shields.io/github/issues-raw/antoniovdlc/with-retry.svg)](https://github.com/AntonioVdlC/with-retry/issues)
[![downloads](https://img.shields.io/npm/dt/with-retry.svg)](http://npm.im/with-retry)
[![license](https://img.shields.io/npm/l/with-retry.svg)](http://opensource.org/licenses/MIT)

Retry asynchronous operations

## Installation

This package is distributed via npm:

```
npm install with-retry
```

## Usage

You can use this library either as an ES module or a CommonJS package:

```js
import withRetry from "with-retry";
```

_- or -_

```js
const withRetry = require("with-retry");
```

You can then wrap any asynchronous function with `withRetry` and pass configuration options:

```js
async function fn() { ... }

const result = await withRetry(fn, { ... });
```

## Configuration

The configuration options are:

```ts
type RetryConfig = {
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
```

Default values are set to:

```js
{
  maxAttempts: 3,
  delay: 100,
  maxDelay: 1000,
  backoffStrategy: "constant",
  jitter: true,
  retryCondition: () => true,
  onRetry: () => {},
  onExhausted: () => {},
  timeout: 0,
}
```

## License

MIT
