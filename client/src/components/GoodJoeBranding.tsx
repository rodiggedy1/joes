/**
 * Good Joe brand treatment: preserve the site's warm paper canvas, symmetrical home mark,
 * lime actions, and service-page layout while keeping public brand language consistent.
 */
import { useEffect } from "react";

const brandText = (value: string) => value
  .replace(/Good House Co\./g, "Good Joe")
  .replace(/Good House Guide/g, "Good Joe Guide")
  .replace(/Good House/g, "Good Joe");

function brandTree(node: Node) {
  if (node.nodeType === Node.TEXT_NODE && node.nodeValue && !node.parentElement?.closest("script, style")) {
    const nextValue = brandText(node.nodeValue);
    if (nextValue !== node.nodeValue) node.nodeValue = nextValue;
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const element = node as HTMLElement;
  for (const attribute of ["aria-label", "placeholder", "title"]) {
    const value = element.getAttribute(attribute);
    const nextValue = value ? brandText(value) : value;
    if (nextValue && nextValue !== value) element.setAttribute(attribute, nextValue);
  }
  element.childNodes.forEach(brandTree);
}

export default function GoodJoeBranding() {
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const applyBrand = () => {
      brandTree(root);
      document.title = brandText(document.title);
      document.querySelector('meta[name="description"]')?.setAttribute(
        "content",
        brandText(document.querySelector('meta[name="description"]')?.getAttribute("content") ?? ""),
      );
    };
    applyBrand();
    const observer = new MutationObserver(applyBrand);
    observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["aria-label", "placeholder", "title"] });
    return () => observer.disconnect();
  }, []);

  return null;
}
