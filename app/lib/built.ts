export const buildDate = Temporal.ZonedDateTime.from(
  `${__BUILD_TIME__}[${Temporal.Now.timeZoneId()}]`
);

export const isPublished = (draft: boolean) => !import.meta.env.PROD || !draft;
