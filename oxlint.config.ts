import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["unicorn", "typescript", "oxc", "node", "promise", "jsx-a11y"],
  categories: {
    correctness: "deny",
    pedantic: "warn",
    perf: "warn",
    // restriction: "warn",
    suspicious: "warn",
    style: "warn",
    // Nursery: "warn",
  },
  rules: {
    curly: ["deny", "multi-line", "consistent"],
    "max-statements": "allow",
    "id-length": "allow",
    "no-ternary": "allow",
    "no-magic-numbers": "allow",
    "sort-imports": "allow",
    "sort-keys": "allow",
    "func-style": "allow",
    "capitalized-comments": "allow",
    "oxc/no-rest-spread-properties": "allow",
    "oxc/no-optional-chaining": "allow",
    "typescript/explicit-module-boundary-types": "allow",
    "typescript/no-unsafe-type-assertion": "allow",
    "typescript/prefer-readonly-parameter-types": "allow",
    "typescript/strict-boolean-expressions": "allow",
    "unicorn/catch-error-name": ["warn", { ignore: ["error", "err", "e", "exception", "ex"] }],
  },
  env: { builtin: true, "shared-node-browser": true },
  options: { typeAware: true, typeCheck: true },
});
