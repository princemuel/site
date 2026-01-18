// SPDX-License-Identifier: Apache-2.0
interface Deferred<T> {
  promise: Promise<T>;
  resolve: (result: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}
declare const __brand: unique symbol;

type Brand<T, B extends string> = T & { [__brand]: B };
