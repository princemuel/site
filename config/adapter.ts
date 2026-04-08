import adapter from "@astrojs/vercel";
export default adapter({
  imageService: true,
  devImageService: "sharp",
  staticHeaders: true,
  isr: true,
  middlewareMode: "edge",
});
