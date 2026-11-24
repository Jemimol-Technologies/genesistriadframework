/** Overlays can stack (a guide over a panel), so the page stays locked until the last one closes. */
let open = 0;
export function lockScroll(doc: Document): void { if (open++ === 0) doc.documentElement.classList.add('panel-open'); }
export function unlockScroll(doc: Document): void { if (open > 0 && --open === 0) doc.documentElement.classList.remove('panel-open'); }
