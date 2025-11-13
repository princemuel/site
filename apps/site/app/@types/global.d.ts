// declare namespace globalThis {

//   interface ThemeController {
//     value: "system" | "light" | "dark";
//     selectThemeIcon(theme?: string): void;
//   }

//   // Actual instances on the global object
//   var Theme: ThemeController;

//   interface Window {
//     [Symbol.for("app.theme")]: ThemeController;
//   }
// }

interface ThemeController {
  value?: "system" | "light" | "dark";
  selectThemeIcon(theme?: string): void;
}
