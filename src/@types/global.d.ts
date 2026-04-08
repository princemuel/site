interface ThemeController {
  value?: "system" | "light" | "dark";
  selectThemeIcon(theme?: string): void;
}
