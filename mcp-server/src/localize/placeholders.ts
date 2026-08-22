/** Extract Minecraft-style format placeholders for comparison. */
const PLACEHOLDER_RE = /%(?:\d+\$)?[sd%fx]|%\d+\$[a-zA-Z]/g;

function normalizePlaceholderToken(p: string, sequential: { n: number }): string {
  if (p === "%%") return "%%";
  const indexed = /^%(\d+)\$([a-zA-Z%])$/.exec(p);
  if (indexed) return `%${indexed[1]}$${indexed[2]}`;
  const plain = /^%([sd%fx])$/.exec(p);
  if (plain) {
    sequential.n += 1;
    return `%${sequential.n}$${plain[1]}`;
  }
  return p;
}

export function extractPlaceholders(text: string): string[] {
  const found = text.match(PLACEHOLDER_RE) ?? [];
  const seq = { n: 0 };
  return found.map((p) => normalizePlaceholderToken(p, seq)).sort();
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
