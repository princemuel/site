type RobotsDirective = keyof Robots;

export const toRobotsObject = (directives: RobotsDirective[]): Robots =>
  Object.fromEntries(directives.map((d) => [d, true])) as Robots;
