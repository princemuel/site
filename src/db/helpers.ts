import { customType } from "drizzle-orm/sqlite-core";

export const temporalInstant = customType<{ data: Temporal.Instant; driverData: string }>({
  dataType() {
    return "text";
  },
  toDriver(value: Temporal.Instant) {
    return value.toJSON();
  },
  fromDriver(value: string): Temporal.Instant {
    return Temporal.Instant.from(value);
  },
});
