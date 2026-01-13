// SPDX-License-Identifier: Apache-2.0
/**
 * Generates a numeric sequence (like Python's `range()`).
 *
 * @param {number} start - The first value in the sequence (inclusive).
 * @param {number} stop - The end value (exclusive). The sequence stops before reaching this number.
 * @param {number} step - The increment (or decrement, if negative) between consecutive values.
 * @returns {number[]} An array containing the generated sequence.
 *
 * @example
 * // Simple ascending range
 * range(0, 5, 1);
 * // → [0, 1, 2, 3, 4]
 *
 * @example
 * // Custom step size
 * range(1, 10, 2);
 * // → [1, 3, 5, 7, 9]
 *
 * @example
 * // Generate letters A–Z using Unicode codes.
 * range("A".charCodeAt(0), "Z".charCodeAt(0) + 1, 1).map(x => String.fromCharCode(x));
 * // → ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
 */
export const range = (start: number, stop: number, step = 1): number[] =>
{
  if (step === 0) throw new Error('Step cannot be zero');
  const length = Math.max(0, Math.ceil((stop - start) / step));
  return Array.from({ length }, (_, i) => start + i * step);
}
