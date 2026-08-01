import type { directives } from "@/content/helpers";

type Rbts = (typeof directives)[number];
export type RobotsDirectives = Rbts[];
export const toRobotsObject = (dtvs: RobotsDirectives): Robots =>
  Object.fromEntries((dtvs ?? []).map((dtv) => [dtv, true])) as Robots;
