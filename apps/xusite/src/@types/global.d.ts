// SPDX-License-Identifier: Apache-2.0
interface ThemeController {
  value?: "system" | "light" | "dark";
  selectThemeIcon(theme?: string): void;
}
