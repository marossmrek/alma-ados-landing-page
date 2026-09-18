/*
  Accordion-like timelines (only the active stop shows its step chips) change height as the active
  stop changes. A pinned panel is measured once, so we reserve the tallest possible state up front:
  min-height = current height - currently open chips + the tallest chips block.
  Chip wrappers are marked with [data-steps]; their first child holds the real content height.
*/
export function reserveTimelineHeight(list: HTMLElement) {
  list.style.minHeight = "";
  const wrappers = Array.from(list.querySelectorAll<HTMLElement>("[data-steps]"));
  if (!wrappers.length) return;
  const open = wrappers.reduce((sum, w) => sum + w.getBoundingClientRect().height, 0);
  const tallest = Math.max(...wrappers.map((w) => (w.firstElementChild as HTMLElement | null)?.scrollHeight ?? 0));
  const total = list.getBoundingClientRect().height - open + tallest;
  list.style.minHeight = `${Math.ceil(total)}px`;
}
