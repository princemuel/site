// oxlint-disable unicorn/prefer-top-level-await promise/prefer-await-to-then typescript/no-confusing-void-expression unicorn/require-module-specifiers
if (globalThis.Temporal === undefined) {
  void import("temporal-polyfill/shim").then(({ install }) => install());
}

export {};
