/**
 * Deterministic date formatter ensuring zero SSR hydration mismatch.
 */
export function formatDate(isoString: string): string {
  try {
    if (!isoString) return '';
    const datePart = isoString.split('T')[0];
    const parts = datePart.split('-');
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1]}-${parts[2]}`;
    }
    return datePart;
  } catch {
    return isoString;
  }
}
