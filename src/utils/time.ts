/** Convert a DurationLike to total seconds. */
export function toSecs(item: Temporal.DurationLike) {
  return Temporal.Duration.from(item).total("seconds");
}

/** Convert a DurationLike to a Temporal.Duration. */
export function toDuration(item: Temporal.DurationLike): Temporal.Duration {
  return Temporal.Duration.from(item);
}

/**
 * Strip timezone offset and IANA annotation from an ISO 8601 datetime string, leaving a plain
 * local datetime (e.g. "2025-01-15T10:30:00").
 */
export const stripTz = (datetime: string): string =>
  datetime.replace(/(?:[+-]\d{2}:\d{2}|Z)?(?:\[.*?\])?$/u, "");

const UNIT_FIELDS: Record<string, string> = {
  ms: "milliseconds",
  s: "seconds",
  m: "minutes",
  h: "hours",
  d: "days",
} as const;

export function parseDuration(input: string): Temporal.Duration {
  const match = /^(?<amount>\d+(?:\.\d+)?)\s*(?<unit>ms|s|m|h|d)$/u.exec(input.trim());

  if (!match?.groups) {
    throw new Error(`Invalid duration "${input}" — expected e.g. "10 s", "5 m", "500 ms"`);
  }

  const { amount, unit } = match.groups;
  if (!amount || !unit) throw new Error("Invalid values for duration");
  // @ts-expect-error ts(2464) ignoring
  return Temporal.Duration.from({ [UNIT_FIELDS[unit]]: Number(amount) });
}
