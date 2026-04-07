// SPDX-License-Identifier: Apache-2.0

/**
 * Async, non-reentrant mutex protecting a shared object.
 *
 * NON-REENTRANT
 * ----------------
 * The same task MUST NOT attempt to acquire this mutex twice
 * without releasing it first. Doing so will deadlock.
 *
 *
 * Recommended usage:
 *   - `using` / `await using` (automatic release)
 *
 * Safe fallback:
 *   - `lock(fn)` (try/finally enforced)
 *
 * ❌ Unsafe:
 *   - `acquire()` without guaranteed release
 */
type Acquired<T extends object> = T & { release(): void };

export class Mutex<T extends object> {
  #locked = false;
  #queue: PromiseWithResolvers<Acquired<T>>[] = [];

  constructor(private readonly resource: T) {}

  /**
   * Acquire the mutex and receive a guarded view of the resource.
   *
   * ⚠️ You MUST release the guard.
   * Prefer `using` or `lock(fn)` instead of calling this directly.
   */
  async acquire(signal?: AbortSignal): Promise<Acquired<T>> {
    if (!this.#locked) {
      this.#locked = true;
      return this.#guard();
    }

    const deferred = Promise.withResolvers<Acquired<T>>();
    this.#queue.push(deferred);

    if (signal?.aborted) {
      this.#unqueue(deferred);
      throw new Error("Mutex acquisition aborted");
    }

    const handler = () => {
      this.#unqueue(deferred);
      deferred.reject(new Error("Mutex acquisition aborted"));
    };

    signal?.addEventListener("abort", handler);

    try {
      return await deferred.promise;
    } finally {
      signal?.removeEventListener("abort", handler);
    }
  }

  /**
   * Scoped locking helper.
   *
   * Guarantees release even if the callback throws.
   * This is the recommended fallback if `using` is unavailable.
   */
  async lock<R>(fn: (res: T) => Promise<R>, signal?: AbortSignal): Promise<R> {
    const res = await this.acquire(signal);
    try {
      return await fn(res);
    } finally {
      res.release();
    }
  }

  #unqueue(deferred: PromiseWithResolvers<Acquired<T>>) {
    const index = this.#queue.indexOf(deferred);
    if (index !== -1) this.#queue.splice(index, 1);
  }

  #release(): void {
    const next = this.#queue.shift();
    if (next) {
      next.resolve(this.#guard());
    } else {
      this.#locked = false;
    }
  }

  #guard(): Acquired<T> {
    let active = true;

    const release = () => {
      if (!active) return;
      active = false;
      this.#release();
    };

    return new Proxy(this.resource, {
      get: (target, prop, receiver) => {
        if (!active) throw new Error("Cannot access resource through released mutex guard");
        if (prop === "release" || prop === Symbol.dispose || prop === Symbol.asyncDispose) {
          return release;
        }
        return Reflect.get(target, prop, receiver);
      },

      set: (target, prop, value, receiver) => {
        if (!active) throw new Error("Cannot access resource through released mutex guard");
        return Reflect.set(target, prop, value, receiver);
      },
    }) as Acquired<T>;
  }

  /**
   * Destroy the mutex.
   *
   * - Rejects all pending waiters
   * - Unlocks the mutex
   * - Invalidates future acquisitions
   *
   * Intended for shutdown / teardown paths only.
   */
  destroy(): void {
    while (this.#queue.length) {
      this.#queue.shift()?.reject(new Error("Mutex destroyed"));
    }
    this.#locked = false;
  }
}
