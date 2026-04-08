export const secs = (item: Temporal.DurationLike) => Temporal.Duration.from(item).total("seconds");
