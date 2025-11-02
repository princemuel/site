declare namespace globalThis {
  var __singletons__: Map<string, unknown> | undefined;

  interface ThemeController {
    value: "system" | "light" | "dark";
    next(): void;
    apply(): void;
    subscribe(callback: (theme: "system" | "light" | "dark") => void): () => void;

    selectThemeIcon(theme?: string): void;
  }

  // Actual instances on the global object
  var Theme: ThemeController;

  interface Window {
    [Symbol.for("app.theme")]: ThemeController;
  }
}
