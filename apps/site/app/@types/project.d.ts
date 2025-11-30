// SPDX-License-Identifier: Apache-2.0
interface Deferred<T> {
  promise: Promise<T>;
  resolve: (result: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}
