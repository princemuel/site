/**
 * Convert a DurationLike to total seconds.
 */
export function toSeconds(item: Temporal.DurationLike) {
  return Temporal.Duration.from(item).total("seconds");
}

/**
 * Convert a DurationLike to a Temporal.Duration.
 */
export function toDuration(item: Temporal.DurationLike): Temporal.Duration {
  return Temporal.Duration.from(item);
}

/**
 * Strip timezone offset and IANA annotation from an ISO 8601 datetime string,
 * leaving a plain local datetime (e.g. "2025-01-15T10:30:00").
 */
export const stripTz = (datetime: string): string =>
  datetime.replace(/([+-]\d{2}:\d{2})?(\[.*?\])?Z?$/u, "");
