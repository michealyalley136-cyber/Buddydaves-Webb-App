const DEFAULT_ICON = "/images/buddy-daves-logo.png";

let links: HTMLLinkElement[] = [];
let on = false;
let timer: number | null = null;

function getIconLinks(): HTMLLinkElement[] {
  if (typeof document === "undefined") return [];
  return Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]'));
}

export function startFaviconAlert() {
  links = getIconLinks();
  if (links.length === 0) return;
  stopFaviconAlert();
  on = false;
  timer = window.setInterval(() => {
    on = !on;
    for (const link of links) {
      if (on) {
        link.dataset.bdDefaultHref = link.href;
        link.href =
          "data:image/svg+xml," +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#a5422b"/><text x="16" y="21" text-anchor="middle" font-size="14" font-weight="bold" fill="#f6f1e7">!</text></svg>'
          );
      } else if (link.dataset.bdDefaultHref) {
        link.href = link.dataset.bdDefaultHref;
      }
    }
  }, 600);
}

export function stopFaviconAlert() {
  if (timer) window.clearInterval(timer);
  timer = null;
  for (const link of links) {
    if (link.dataset.bdDefaultHref) {
      link.href = link.dataset.bdDefaultHref;
      delete link.dataset.bdDefaultHref;
    } else {
      link.href = DEFAULT_ICON;
    }
  }
  links = [];
}
