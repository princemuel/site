import { $ } from "@/helpers/dom";

(() => {
  const today = Temporal.Now.plainDateISO();
  if (!(today.month === 4 && today.day === 9)) return;

  const isNotIgnored = <E extends Element>(el: E) =>
    el.getAttribute("data-cssnakedday") !== "ignore";

  // Remove all linked stylesheets and style blocks
  for (const element of [
    ...$(`link[rel~="stylesheet"]`, HTMLLinkElement, true),
    ...$(`style`, HTMLStyleElement, true),
  ]) {
    if (isNotIgnored(element)) element.remove();
  }

  // Remove all inline styles
  for (const element of $("[style]", Element, true)) {
    if (isNotIgnored(element)) element.removeAttribute("style");
  }

  // Inject a message at the top of the body for site vistors
  const fragment = document.createDocumentFragment();
  const p = Object.assign(document.createElement("p"), {
    textContent: "Why is this page looking so simple? It's ",
  });
  const a = Object.assign(document.createElement("a"), {
    href: "https://css-naked-day.org",
    textContent: "CSS Naked Day",
    target: "_blank",
    rel: "noopener noreferrer jangled",
  });

  p.append(a, "!");
  fragment.append(p, document.createElement("hr"));
  document.body.prepend(fragment);
})();
