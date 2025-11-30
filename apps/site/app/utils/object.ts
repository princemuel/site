// SPDX-License-Identifier: Apache-2.0
export const serialize = <T>(data: T, options?: StructuredSerializeOptions) => structuredClone(data, options);

type Key = string | number | symbol;
export function omit<T extends Record<Key, any>, K extends keyof T>(obj: T, key: K): Omit<T, K>;
export function omit<T extends Record<Key, any>, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K>;
export function omit<T extends Record<Key, any>, K extends keyof T>(
  obj: T,
  keyOrKeys: K | readonly K[],
): Omit<T, K> {
  const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
  const keySet = new Set(keys as ReadonlyArray<Key>);
  const result: Partial<T> = {};

  // Reflect.ownKeys gives you *both* string and symbol keys
  for (const key of Reflect.ownKeys(obj)) {
    if (keySet.has(key)) continue;
    (result as any)[key] = obj[key];
  }

  return result as Omit<T, K>;
}
