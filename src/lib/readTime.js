export function formatReadTime(value, locale = 'en') {
  const number = Math.max(1, Number.parseInt(String(value || ''), 10) || 5);
  return locale === 'tr' ? `${number} dk` : `${number} min`;
}
