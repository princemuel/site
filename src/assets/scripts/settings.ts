import { toSeconds } from "@/utils/time";

const SESSION_DURATION: Temporal.DurationLike = { days: 28 };

function getClientLocale(): { tz: string; locale: string } {
  const { timeZone: tz, locale } = new Intl.DateTimeFormat().resolvedOptions();
  return { tz, locale };
}

async function setLocaleCookies(): Promise<void> {
  const { tz, locale } = getClientLocale();
  const expires = new Date()
    .toTemporalInstant()
    .add({ seconds: toSeconds(SESSION_DURATION) }).epochMilliseconds;

  const options: Partial<CookieInit> = {
    expires,
    path: "/",
    sameSite: "lax",
    partitioned: import.meta.env.PROD,
  };
  await globalThis.cookieStore.set({ name: "timezone", value: tz, ...options });
  await globalThis.cookieStore.set({ name: "locale", value: locale, ...options });
}

await setLocaleCookies().catch((err) => {
  console.error("[locale-cookie] Failed to set locale cookies:", err);
});
