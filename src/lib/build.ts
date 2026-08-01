export const built = Temporal.Instant.from(__BUILD_TIME__).toZonedDateTimeISO("UTC");

export const published = (draft = false) => !import.meta.env.PROD || !draft;
