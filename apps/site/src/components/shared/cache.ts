// Per-request icon deduplication cache (SSR only)
// Maps each Request to a map of icon-id → render count
export const cache = new WeakMap<Request, Map<string, number>>();
