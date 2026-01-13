// SPDX-License-Identifier: Apache-2.0
export const println$ = import.meta.env.DEV
  ? (msg?: unknown, ...args: unknown[]) => console.info(`[${Temporal.Now.instant().toString()}]`, msg, ...args)
  : () => {};
