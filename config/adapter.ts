import adapter from "@astrojs/netlify";
export default adapter({
  cacheOnDemandPages: true,
  imageCDN: true,
  staticHeaders: true,
  devFeatures: false,
});
// import adapter from "@astrojs/vercel";
// export default adapter({
//   imageService: true,
//   devImageService: "sharp",
//   staticHeaders: true,
//   isr: true,
//   middlewareMode: "edge",
// });
