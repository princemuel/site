export const buildDate = Temporal.ZonedDateTime.from(
  `${__BUILD_TIME__}[${Temporal.Now.timeZoneId()}]`,
);
