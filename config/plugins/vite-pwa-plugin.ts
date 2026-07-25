// oxlint-disable require-unicode-regexp no-continue typescript/no-unsafe-assignment max-params
import { fileURLToPath } from "node:url";

import type { AstroConfig, AstroIntegration } from "astro";
import type { Plugin } from "vite";
import { VitePWA as pwa, type VitePluginPWAAPI, type VitePWAOptions } from "vite-plugin-pwa";
import type { ManifestEntry, ManifestTransform } from "workbox-build";

export interface PwaOptions extends Partial<VitePWAOptions> {
  experimental?: {
    /**
     * When using `generateSW` strategy, include custom directory and trailing slash handler.
     *
     * @default false
     * @see https://github.com/vite-pwa/astro/issues/23
     * @see https://github.com/slorber/trailing-slash-guide
     * @see https://slorber.github.io/trailing-slash-guide/
     */
    directoryAndTrailingSlashHandler?: boolean;
  };
}

interface PWAContext {
  api?: VitePluginPWAAPI;
  previewOrSync: boolean;
  doBuild: boolean;
  scope: string;
  useDirectoryFormat: boolean;
  trailingSlash: "never" | "always" | "ignore";
}

const PWA_PLUGIN_NAME = `vite-plugin-pwa`;
const PWA_BUILD_PLUGIN_NAME = `${PWA_PLUGIN_NAME}:build`;
const PWA_DEV_SW_PLUGIN_NAME = `${PWA_PLUGIN_NAME}:dev-sw`;

export default function pwaAstro(options: PwaOptions = {}): AstroIntegration {
  const ctx: PWAContext = {
    api: undefined,
    previewOrSync: false,
    doBuild: false,
    scope: "/",
    trailingSlash: "ignore",
    useDirectoryFormat: true,
  };

  const context = (): PWAContext => ctx;

  return {
    name: "@vite-pwa/integration",
    hooks: {
      "astro:config:setup": ({ command, config, updateConfig }) => {
        if (command === "preview" || command === "sync") {
          ctx.previewOrSync = true;
          return;
        }

        ctx.scope = config.base ?? config.vite.base ?? "/";
        ctx.trailingSlash = config.trailingSlash;
        ctx.useDirectoryFormat = config.build.format === "directory";

        const isBuild = command === "build";
        const excluded = new Set([
          PWA_BUILD_PLUGIN_NAME,
          ...(isBuild ? [PWA_DEV_SW_PLUGIN_NAME] : []),
        ]);

        const plugins = getViteConfiguration(
          config,
          options,
          ctx.useDirectoryFormat,
          context,
        ).filter((p) => !("name" in p) || !excluded.has(p.name));

        if (isBuild) plugins.push(createAstroPwaBuildPlugin(ctx));

        updateConfig({ vite: { plugins } });
      },
      "astro:build:done": async () => {
        if (ctx.previewOrSync) return;
        ctx.doBuild = true;

        const { api } = ctx;
        if (api && !api.disabled) await api.generateSW();
      },
    },
  };
}

function createAstroPwaBuildPlugin(ctx: PWAContext): Plugin {
  return {
    name: "vite-pwa:astro:build:plugin",
    applyToEnvironment(env) {
      return env.name === "client";
    },
    configResolved(resolvedConfig) {
      // Look up the PWA plugin's API from the client pipeline. skip on the
      // server build so we don't generate the web manifest / registerSW twice.
      if (resolvedConfig.build.ssr) return;

      ctx.api = resolvedConfig.plugins
        .flat(Infinity)
        .find((plugin) => plugin.name === PWA_PLUGIN_NAME)?.api;
    },

    async generateBundle(_options, bundle) {
      if (!ctx.api) return;
      const pwaAssetsGenerator = await ctx.api.pwaAssetsGenerator();
      pwaAssetsGenerator?.injectManifestIcons();
      //@ts-expect-error 'string' index signatures are incompatible.
      ctx.api.generateBundle(bundle, this);
    },
    closeBundle: {
      sequential: true,
      order: "post",
      async handler() {
        const pwaAssetsGenerator = await ctx.api?.pwaAssetsGenerator();
        await pwaAssetsGenerator?.generate();
      },
    },
  };
}

function createManifestTransform(pwaContext: () => PWAContext): ManifestTransform {
  return (entries) => {
    const context = pwaContext();
    if (!context.doBuild) return { manifest: entries, warnings: [] };

    // apply transformation only when build enabled
    for (const entry of entries) {
      if (!entry || !entry.url.endsWith(".html")) continue;
      entry.url = resolveHtmlUrl(entry.url, context);
    }

    return { manifest: entries, warnings: [] };
  };
}

/**
 * Converts an `.html` entry's URL into its final served URL, applying directory-format and
 * trailing-slash rules. Returns `undefined` for the `index.html` case, since that one maps
 * directly to `scope` rather than going through path-splitting.
 */
function resolveHtmlUrl(
  entryUrl: string,
  {
    scope,
    trailingSlash,
    useDirectoryFormat,
  }: Pick<PWAContext, "scope" | "trailingSlash" | "useDirectoryFormat">,
): string {
  const url = entryUrl.startsWith("/") ? entryUrl.slice(1) : entryUrl;

  if (url === "index.html") return scope;

  const parts = url.split("/");
  const last = parts.length - 1;
  parts[last] = (parts[last] ?? "").replace(/\.html$/, "");

  let newUrl =
    useDirectoryFormat && parts.length > 1 ? parts.slice(0, last).join("/") : parts.join("/");

  if (trailingSlash === "always") newUrl += "/";

  return newUrl;
}

function createExperimentalManifestTransform(pwaContext: () => PWAContext): ManifestTransform {
  return (entries) => {
    const context = pwaContext();
    if (!context.doBuild) return { manifest: entries, warnings: [] };

    const { trailingSlash } = context;
    const additionalEntries: (ManifestEntry & { size: number })[] = [];
    const suffix = trailingSlash === "always" ? "/" : "";

    // apply transformation only when build enabled
    for (const entry of entries) {
      if (!entry || !entry.url.endsWith(".html")) continue;

      const url = entry.url.startsWith("/") ? entry.url.slice(1) : entry.url;

      if (url === "404.html") {
        entry.url = `404${suffix}`;
        continue;
      }

      additionalEntries.push({
        revision: entry.revision,
        url: resolveHtmlUrl(entry.url, context),
        size: entry.size,
      });
    }

    if (additionalEntries.length > 0) entries.push(...additionalEntries);

    return { manifest: entries, warnings: [] };
  };
}

function getViteConfiguration(
  config: AstroConfig,
  options: PwaOptions,
  directoryFormat: boolean,
  pwaContext: () => PWAContext,
) {
  // @ts-expect-error TS2589: Type instantiation is excessively deep and possibly infinite.
  const plugin = (config.vite?.plugins ?? [])
    .flat(Infinity)
    .find((p: Plugin) => p.name === PWA_PLUGIN_NAME);

  if (plugin) {
    throw new Error(
      "Remove the vite-plugin-pwa plugin from Vite Plugins entry in Astro config file, configure it via the integration",
    );
  }

  // icons are there when `astro:build:done` hook is called
  options.includeManifestIcons = false;

  const server = config.output === "server";

  if (server) options.outDir = fileURLToPath(config.build.client);

  if (options.pwaAssets) {
    options.pwaAssets.integration = {
      baseUrl: config.base ?? config.vite.base ?? "/",
      publicDir: fileURLToPath(config.publicDir),
      outDir: server ? options.outDir : fileURLToPath(config.outDir),
    };
  }

  const {
    strategies = "generateSW",
    registerType = "prompt",
    injectRegister,
    workbox = {},
    ...rest
  } = options;

  let assets = config.build.assets ?? "_astro/";
  if (assets.startsWith("/")) assets = assets.slice(1);
  if (assets.at(-1) !== "/") assets += "/";

  const manifestTransform = () =>
    options.experimental?.directoryAndTrailingSlashHandler
      ? createExperimentalManifestTransform(pwaContext)
      : createManifestTransform(pwaContext);

  if (strategies === "generateSW") {
    const useWorkbox = { ...workbox };
    const newOptions: Partial<VitePWAOptions> = {
      ...rest,
      strategies,
      registerType,
      injectRegister,
    };

    if (server) useWorkbox.globDirectory = options.outDir;

    // the user may want to disable offline support
    if (!("navigateFallback" in useWorkbox)) {
      useWorkbox.navigateFallback = config.base ?? config.vite?.base ?? "/";
    }

    if (directoryFormat) useWorkbox.directoryIndex = "index.html";

    newOptions.workbox = useWorkbox;
    // allow override dontCacheBustURLsMatching
    if (!("dontCacheBustURLsMatching" in newOptions.workbox)) {
      newOptions.workbox.dontCacheBustURLsMatching = new RegExp(assets);
    }

    if (!newOptions.workbox.manifestTransforms) {
      newOptions.workbox.manifestTransforms ??= [];
      newOptions.workbox.manifestTransforms.push(manifestTransform());
    }

    return pwa(newOptions);
  }

  options.injectManifest ??= {};

  if (server) options.injectManifest.globDirectory = options.outDir;

  // allow override dontCacheBustURLsMatching
  if (!("dontCacheBustURLsMatching" in options.injectManifest)) {
    options.injectManifest.dontCacheBustURLsMatching = new RegExp(assets);
  }

  if (!options.injectManifest.manifestTransforms) {
    options.injectManifest.manifestTransforms = [];
    options.injectManifest.manifestTransforms.push(manifestTransform());
  }

  return pwa(options);
}
