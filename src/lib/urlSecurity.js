export function parseSafeHttpUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) return null;

  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed : null;
  } catch {
    return null;
  }
}

export function getSafeHttpUrl(value) {
  return parseSafeHttpUrl(value)?.href || null;
}

export function hostnameMatches(url, expectedHostname) {
  const parsed = typeof url === 'string' ? parseSafeHttpUrl(url) : url;
  if (!parsed) return false;

  const hostname = parsed.hostname.toLowerCase();
  const expected = expectedHostname.toLowerCase();
  return hostname === expected || hostname.endsWith(`.${expected}`);
}

export function getSpotifyResource(value) {
  const parsed = parseSafeHttpUrl(value);
  if (!parsed || !hostnameMatches(parsed, 'spotify.com')) return null;

  const segments = parsed.pathname.split('/').filter(Boolean);
  const typeIndex = segments.findIndex((segment) => ['track', 'album', 'playlist'].includes(segment));
  if (typeIndex < 0) return null;

  const type = segments[typeIndex];
  const id = segments[typeIndex + 1];
  if (!id || id.length > 64 || ![...id].every((character) => /[A-Za-z0-9]/.test(character))) return null;

  return { type, id };
}

export function getSpotifyEmbedUrl(value) {
  const resource = getSpotifyResource(value);
  if (!resource) return null;

  return `https://open.spotify.com/embed/${resource.type}/${resource.id}?utm_source=generator&theme=0`;
}
