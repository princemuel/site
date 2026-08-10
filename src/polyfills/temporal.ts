import { install } from "temporal-polyfill/shim";

if (globalThis.Temporal === undefined) install();
