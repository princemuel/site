// oxlint-disable no-nested-ternary typescript/unified-signatures

/**
 * Generates a numeric sequence (similar to Python's `range()`).
 *
 * Supports multiple call signatures:
 *
 * @example
 *   // range(stop)
 *   [...range(5)];
 *   // → [0, 1, 2, 3, 4]
 *
 * @example
 *   // range(start, stop)
 *   [...range(1, 5)];
 *   // → [1, 2, 3, 4]
 *
 * @example
 *   // range with step
 *   [...range(1, 10, { step: 2 })];
 *   // → [1, 3, 5, 7, 9]
 *
 * @example
 *   // descending
 *   [...range(5, 0, { step: -1 })];
 *   // → [5, 4, 3, 2, 1]
 *
 * @example
 *   // inclusive end
 *   [...range(0, 5, { inclusive: true })];
 *   // → [0, 1, 2, 3, 4, 5]
 *
 * @example
 *   // Lazy evaluation - only computes what you need
 *   for (const n of range(1_000_000)) {
 *     if (n > 5) break; // Only generates 0-6, not all million numbers
 *     console.log(n);
 *   }
 *
 * @example
 *   // Generate letters A–Z using Unicode codes.
 *   [...range("A".charCodeAt(0), "Z".charCodeAt(0) + 1)].map((x) => String.fromCharCode(x));
 *   // → ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
 *
 * @overload Range(stop)
 * @overload Range(start, stop)
 * @overload Range(start, stop, options)
 * @param stop The end value (exclusive).
 * @param start The first value in the sequence (inclusive).
 * @param stop The end value (exclusive).
 * @param start The first value in the sequence (inclusive).
 * @param stop The end value (exclusive).
 * @param options.step Step size. The increment (or decrement, if negative) between consecutive
 *   values. (default: 1).
 * @param options.inclusive Whether to include the stop value (default: false).
 * @yields {number} Each value in the sequence.
 */
export function range(stop: number): Generator<number>;
export function range(start: number, stop: number): Generator<number>;
export function range(
  start: number,
  stop: number,
  options: { step?: number; inclusive?: boolean },
): Generator<number>;
export function* range(
  a: number,
  b?: number,
  options: { step?: number; inclusive?: boolean } = {},
): Generator<number> {
  const [start, stop] = b === undefined ? [0, a] : [a, b];
  const { step = 1, inclusive = false } = options;

  if (step === 0) throw new Error("Step cannot be zero");

  // Prevent infinite loops by skipping the iteration setup if the range is impossible
  const forward = step > 0;
  if ((forward && start > stop) || (!forward && start < stop)) return;

  const end = forward ? (inclusive ? stop + 1 : stop) : inclusive ? stop - 1 : stop;

  if (forward) {
    for (let i = start; i < end; i += step) yield i;
  } else {
    for (let i = start; i > end; i += step) yield i;
  }
}
