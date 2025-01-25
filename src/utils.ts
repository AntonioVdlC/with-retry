/**
 * Checks if the value is a finite number.
 * @param value unknown
 * @returns boolean
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

/**
 * Checks if the value is a function.
 * @param value unknown
 * @returns boolean
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}
