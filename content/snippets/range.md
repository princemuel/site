---
title: range
description: A lazy, Python-style range() generator for numeric sequences, supporting start/stop/step and inclusive bounds.
date: "2024-11-30T06:00:00Z"
updated: "2024-11-30T06:00:00Z"
published: "draft"
priority: 2
tags:
  - typescript
  - generators
  - iterators
  - utility"
category: snippets
language: typescript
---

## What it does

`range()` mimics Python's `range()` builtin and lazily generates a sequence of numbers
without allocating an array. Because it's a generator, values are produced one at a time
as they're consumed meaning that `range(1_000_000)` costs nothing until you actually iterate
into it,
and breaking early (e.g. `for...of` + `break`) stops computation immediately.

## Signature

```ts
range(stop)
range(start, stop)
range(start, stop, { step?, inclusive? })
```

| Param       | Type      | Default | Description                                     |
| ----------- | --------- | ------- | ----------------------------------------------- |
| `start`     | `number`  | `0`     | First value (inclusive)                         |
| `stop`      | `number`  | —       | End value (exclusive, unless `inclusive: true`) |
| `step`      | `number`  | `1`     | Increment; negative for descending sequences    |
| `inclusive` | `boolean` | `false` | Include `stop` in the output                    |

## Usage

```ts
[...range(5)];
// → [0, 1, 2, 3, 4]

[...range(1, 5)];
// → [1, 2, 3, 4]

[...range(1, 10, { step: 2 })];
// → [1, 3, 5, 7, 9]

[...range(5, 0, { step: -1 })];
// → [5, 4, 3, 2, 1]

[...range(0, 5, { inclusive: true })];
// → [0, 1, 2, 3, 4, 5]
```

### Lazy evaluation

```ts
for (const n of range(1_000_000)) {
  if (n > 5) break; // only 0-6 are ever generated
  console.log(n);
}
```

### Generating character ranges

```ts
[...range("A".charCodeAt(0), "Z".charCodeAt(0) + 1)].map((x) => String.fromCharCode(x));
// → ["A", "B", ..., "Z"]
```

## Implementation

```typescript
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
 *   // → ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q",
 * "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
 *
 * @overload range(stop)
 * @overload range(start, stop)
 * @overload range(start, stop, options)
 * @param stop - the end value (exclusive).
 * @param start - the first value in the sequence (inclusive).
 * @param stop - the end value (exclusive).
 * @param start - the first value in the sequence (inclusive).
 * @param stop - the end value (exclusive).
 * @param options.step - Step size. The increment (or decrement, if negative) between
 *   consecutive values. (default: 1).
 * @param options.inclusive - Whether to include the stop value (default: false).
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
```

```js
// copyable JS version
export function* range(a, b, options = {}) {
  const [start, stop] = b === undefined ? [0, a] : [a, b];
  const { step = 1, inclusive = false } = options;
  if (step === 0) {
    throw new Error("Step cannot be zero");
  }
  // Prevent infinite loops by skipping the iteration setup if the range is impossible
  const forward = step > 0;
  if ((forward && start > stop) || (!forward && start < stop)) return;

  const end = forward ? (inclusive ? stop + 1 : stop) : inclusive ? stop - 1 : stop;
  if (forward) {
    for (let i = start; i < end; i += step) {
      yield i;
    }
  } else {
    for (let i = start; i > end; i += step) {
      yield i;
    }
  }
}
```

## Notes / Gotchas

- The direction is inferred from `step`'s sign, not from comparing `start` and `stop`.
  So `range(0, 5, { step: -1 })` returns an empty sequence rather than counting backward.
  You must supply a negative step yourself to descend.
- `step: 0` throws rather than looping forever, which is the right call, but it means
  callers computing `step` dynamically need to guard against a zero result.
- Using floating point steps (e.g. `step: 0.1`) works but is subject to normal floating-point drift.
- It returns a `Generator<number>`, not an array. Call sites that need random access
  or `.length` should spread it first (`[...range(...)]`), which reintroduces the O(n) memory cost.
