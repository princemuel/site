// oxlint-disable no-ternary
// oxlint-disable no-unsafe-type-assertion
// SPDX-License-Identifier: Apache-2.0
export const serialize = <T>(data: T, options?: StructuredSerializeOptions) =>
  structuredClone(data, options);

type Key = string | number | symbol;
export function omit<T extends Record<Key, unknown>, K extends keyof T>(obj: T, key: K): Omit<T, K>;
export function omit<T extends Record<Key, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K>;
export function omit<T extends Record<Key, unknown>, K extends keyof T>(
  obj: T,
  keyOrKeys: K | readonly K[],
): Omit<T, K> {
  const keys = (Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys]) as readonly K[];
  const keySet = new Set(keys);
  const result: T = {} as T;

  // oxlint-disable-next-line no-unsafe-type-assertion
  for (const key of Reflect.ownKeys(obj) as K[]) {
    if (!keySet.has(key)) result[key] = obj[key];
  }

  return result as Omit<T, K>;
}
