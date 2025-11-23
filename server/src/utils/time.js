/**
 * Derive a YYYY-MM-DD label using midnight in America/Los_Angeles.
 * This keeps all daily snapshots aligned to a single platform timezone (PST/PDT).
 */
export function getPstDateLabel(date = new Date()) {
  const pstString = date.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const [month, day, year] = pstString.split('/');
  return `${year}-${month}-${day}`;
}
