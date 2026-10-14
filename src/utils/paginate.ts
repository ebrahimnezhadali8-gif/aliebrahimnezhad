/**
 * Splits a list into fixed-size pages, the way an iPhone home screen holds a
 * fixed number of icons per page. Pure, so the paging maths is directly testable.
 */
export function paginate<T>(items: T[], perPage: number): T[][] {
  if (perPage <= 0) return [items.slice()];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += perPage) {
    pages.push(items.slice(i, i + perPage));
  }
  // Always at least one page, so the UI never renders an empty pager.
  return pages.length ? pages : [[]];
}
