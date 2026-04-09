export const println$ = import.meta.env.vercel.app
  ? (msg?: unknown, ...args: unknown[]) =>
      console.info(`[${Temporal.Now.instant().toString()}]`, msg, ...args)
  : () => {};
