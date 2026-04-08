// SPDX-License-Identifier: Apache-2.0
/**
 * Generates a numeric sequence (like Python's `range()`).
 *
 * Supports multiple call signatures:
 *
 * @overload
 * range(stop)
 * @param stop - The end value (exclusive).
 *
 * @overload
 * range(start, stop)
 * @param start - The first value in the sequence (inclusive).
 * @param stop - The end value (exclusive).
 *
 * @overload
 * range(start, stop, options)
 * @param start - The first value in the sequence (inclusive).
 * @param stop - The end value (exclusive).
 * @param options.step - Step size (default: 1).
 * @param options.inclusive - Whether to include the stop value (default: false).
 *
 * @yields {number} Each value in the sequence.
 *
 * @example
 * // range(stop)
 * [...range(5)]
 * // → [0, 1, 2, 3, 4]
 *
 * @example
 * // range(start, stop)
 * [...range(1, 5)]
 * // → [1, 2, 3, 4]
 *
 * @example
 * // range with step
 * [...range(1, 10, { step: 2 })]
 * // → [1, 3, 5, 7, 9]
 *
 * @example
 * // descending
 * [...range(5, 0, { step: -1 })]
 * // → [5, 4, 3, 2, 1]
 *
 * @example
 * // inclusive end
 * [...range(0, 5, { inclusive: true })]
 * // → [0, 1, 2, 3, 4, 5]
 *
 * @example
 * // lazy evaluation
 * for (const n of range(1_000_000)) {
 *   if (n > 5) break;
 *   console.log(n);
 * }
 *
 * @example
 * // A–Z via Unicode
 * [...range("A".charCodeAt(0), "Z".charCodeAt(0) + 1)]
 *   .map(c => String.fromCharCode(c));
 */
export function range(stop: number): Generator<number>;
export function range(start: number, stop: number): Generator<number>;
export function range(
  start: number,
  stop: number,
  options: { step?: number; inclusive?: boolean }
): Generator<number>;
export function* range(
  ...args: [number] | [number, number] | [number, number, { step?: number; inclusive?: boolean }]
): Generator<number> {
  let start: number;
  let stop: number;
  let step = 1;
  let inclusive = false;

  // Argument normalization
  if (args.length === 1) {
    [stop] = args;
    start = 0;
  } else if (args.length === 2) {
    [start, stop] = args;
  } else {
    [start, stop, { step = 1, inclusive = false }] = args;
  }

  if (step === 0) throw new Error("Step cannot be zero");

  const forward = step > 0;

  // Prevent infinite loops
  if (forward && start > stop) return;
  if (!forward && start < stop) return;

  if (forward) {
    const end = inclusive ? stop + 1 : stop;
    for (let i = start; i < end; i += step) yield i;
  } else {
    const end = inclusive ? stop - 1 : stop;
    for (let i = start; i > end; i += step) yield i;
  }
}
