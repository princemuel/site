import adapter from "@astrojs/node";
export default adapter({
  mode: "standalone",
  staticHeaders: true,
});
