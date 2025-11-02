import { createDeferred } from "./deferred";

type AcquiredMutex<T> = T & { release: () => void };

export class Mutex<T extends object> {
  #locked = false;
  #guard: MutexGuard<T> | null = null;
  #waitlist: Deferred<AcquiredMutex<T>>[] = [];

  constructor(private readonly resource: T) {}

  public async acquire(): Promise<AcquiredMutex<T>> {
    if (!this.#locked) {
      this.#locked = true;
      return this.#createGuardedResource();
    }

    const deferred = createDeferred<AcquiredMutex<T>>();
    this.#waitlist.push(deferred);
    return deferred.promise;
  }

  #createGuardedResource(): AcquiredMutex<T> {
    this.#guard = new MutexGuard(this);
    return new Proxy(this.resource, this.#guard) as AcquiredMutex<T>;
  }

  public release(): void {
    if (!this.#locked) {
      throw new Error("Cannot release an already released mutex");
    }

    if (this.#guard) {
      this.#guard.invalidate();
      this.#guard = null;
    }

    // Process next waiter or unlock
    const waiter = this.#waitlist.shift();
    if (waiter) {
      // Keep locked, pass to next waiter
      waiter.resolve(this.#createGuardedResource());
    } else {
      // No more waiters, unlock
      this.#locked = false;
    }
  }

  public get isAcquired(): boolean {
    return this.#locked;
  }

  public get length(): number {
    return this.#waitlist.length;
  }

  // Cleanup method for graceful shutdown
  public destroy(): void {
    // Reject all pending waiters
    while (this.#waitlist.length > 0) {
      const waiter = this.#waitlist.shift();
      waiter?.reject(new Error("Mutex was destroyed"));
    }

    // Invalidate current guard
    if (this.#guard) {
      this.#guard.invalidate();
      this.#guard = null;
    }

    this.#locked = false;
  }
}

export class MutexGuard<T extends object> implements ProxyHandler<T> {
  #isValid = true;

  constructor(private readonly mutex: Mutex<T>) {}

  public invalidate(): void {
    this.#isValid = false;
  }

  // Proxy handler methods
  public get(target: T, property: PropertyKey, receiver: any): any {
    // Check if guard is still valid
    if (!this.#isValid)
      throw new Error("Cannot access resource through invalidated mutex guard");

    // Intercept release calls
    if (property === "release") {
      return this.#createReleaseFunction();
    }

    // Forward all other property access
    return Reflect.get(target, property, receiver);
  }

  public set(target: T, property: PropertyKey, value: any, receiver: any): boolean {
    if (!this.#isValid)
      throw new Error("Cannot modify resource through invalidated mutex guard");

    return Reflect.set(target, property, value, receiver);
  }

  public has(target: T, property: PropertyKey): boolean {
    if (!this.#isValid) throw new Error("Cannot check properties on invalidated mutex guard");

    // Always report that 'release' exists
    return property === "release" || Reflect.has(target, property);
  }

  public ownKeys(target: T): ArrayLike<string | symbol> {
    if (!this.#isValid)
      throw new Error("Cannot enumerate properties on invalidated mutex guard");

    const keys = Reflect.ownKeys(target);
    // Add 'release' to the keys if it's not already there
    if (!keys.includes("release")) return [...keys, "release"];

    return keys;
  }

  public getOwnPropertyDescriptor(
    target: T,
    property: PropertyKey,
  ): PropertyDescriptor | undefined {
    if (!this.#isValid)
      throw new Error("Cannot get property descriptor on invalidated mutex guard");

    if (property === "release") {
      return {
        value: this.#createReleaseFunction(),
        writable: false,
        enumerable: false,
        configurable: false,
      };
    }

    return Reflect.getOwnPropertyDescriptor(target, property);
  }

  #createReleaseFunction(): () => void {
    let released = false;
    return () => {
      // Silent no-op on double release - this is often safer than throwing
      if (released) return;
      released = true;
      this.mutex.release();
    };
  }
}
