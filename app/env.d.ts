/// <reference types="../.astro/icon.d.ts" />
<<<<<<< HEAD
=======

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    otherLocals: {
      test: string;
    };
  }
}
>>>>>>> beta
