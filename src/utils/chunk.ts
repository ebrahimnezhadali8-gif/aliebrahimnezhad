/**
 * Splits a list into fixed-size groups. Pure, so the layout maths is testable.
 *
 * The home screen uses this to build explicit rows of icons: a row that isn't
 * full gets centred as a whole, instead of hugging the left edge the way a
 * partially-filled CSS grid row does.
 */
export function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items.slice()];
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size));
  }
  return groups.length ? groups : [[]];
}
