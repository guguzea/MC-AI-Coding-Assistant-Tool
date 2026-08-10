/** Extract Minecraft-style format placeholders for comparison. */
const PLACEHOLDER_RE = /%(?:\d+\$)?[sd%]|%\d+\$[a-zA-Z]/g;

export function extractPlaceholders(text: string): string[] {
  const found = text.match(PLACEHOLDER_RE) ?? [];
  return found.slice().sort();
}

export function placeholdersMatch(a: string, b: string): boolean {
  const pa = extractPlaceholders(a);
  const pb = extractPlaceholders(b);
  if (pa.length !== pb.length) return false;
  for (let i = 0; i < pa.length; i++) {
    if (pa[i] !== pb[i]) return false;
  }
  return true;
}
