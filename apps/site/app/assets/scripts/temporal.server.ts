export default async () => {
  if (typeof Temporal === "undefined") await import("temporal-polyfill/global");
};
