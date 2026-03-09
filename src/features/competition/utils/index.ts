/**
 * Check if a competitor has already been seen at a given table (BR-2).
 * Pure function version — takes a list of existing submissions rather than querying the DB.
 */
export function validateNoRepeatCompetitor(
  existingSubmissions: Array<{ tableId: string; competitorId: string }>,
  tableId: string,
  competitorId: string
): boolean {
  return !existingSubmissions.some(
    (s) => s.tableId === tableId && s.competitorId === competitorId
  );
}
