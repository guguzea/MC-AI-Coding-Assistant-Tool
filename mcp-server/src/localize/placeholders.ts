/** Extract Minecraft-style format placeholders for comparison.
 *  Compare already-parsed lang *values* only — file-level `{` / JSON braces must not enter.
 */
const FORMATTER_RE = /%(?:\d+\$)?(?:\.\d+)?[sSdDfFx%]|%\d+\$[a-zA-Z]/g;
/** MessageFormat `{0}` / `{}`. `{name}` / `{@x}` / JSON objects are NOT placeholders. */
const MESSAGE_FORMAT_RE = /\{(\d+)\}|\{\}/g;

export type PlaceholderKind = { indexed: string | null; type: string };

/** Normalize %s / %S / %.2f / %2$s / {0} / {} into a comparable kind. Sequential tokens keep indexed=null. */
export function placeholderKind(p: string): PlaceholderKind {
  if (p === "%%") return { indexed: null, type: "%%" };
  if (p === "{}") return { indexed: null, type: "s" };
  const mf = /^\{(\d+)\}$/.exec(p);
  if (mf) return { indexed: String(Number(mf[1]) + 1), type: "s" };
  const indexed = /^%(\d+)\$(\.\d+)?([a-zA-Z%])$/.exec(p);
  if (indexed) return { indexed: indexed[1], type: indexed[3].toLowerCase() };
  const plain = /^%(\.\d+)?([sSdDfFx%])$/.exec(p);
  if (plain) return { indexed: null, type: plain[2].toLowerCase() };
  return { indexed: null, type: p };
}

export function extractRawPlaceholders(text: string): string[] {
  const found: { index: number; value: string }[] = [];
  for (const re of [FORMATTER_RE, MESSAGE_FORMAT_RE]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      found.push({ index: m.index, value: m[0] });
    }
  }
  found.sort((a, b) => a.index - b.index);
  return found.map((f) => f.value);
}

function typeMultiset(kinds: PlaceholderKind[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const k of kinds) {
    if (k.type === "%%") continue;
    m.set(k.type, (m.get(k.type) ?? 0) + 1);
  }
  return m;
}

function mapsEqual(a: Map<string, number>, b: Map<string, number>): boolean {
  if (a.size !== b.size) return false;
  for (const [k, v] of a) {
    if (b.get(k) !== v) return false;
  }
  return true;
}

function indexKey(k: PlaceholderKind): string {
  return `${k.indexed}$${k.type}`;
}

function keysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const as = [...a].sort();
  const bs = [...b].sort();
  return as.every((x, i) => x === bs[i]);
}

function seqAsIndexed(seq: PlaceholderKind[]): PlaceholderKind[] {
  return seq.map((k, i) => ({ indexed: String(i + 1), type: k.type }));
}

/**
 * Sequential placeholders (`%s and %d` vs `%d ge, %s`) match by type multiset.
 * Numbered placeholders (`%2$s`) match by index+type.
 * `{0}` is MessageFormat index 0 ≡ sequential `%s` / `%1$s`.
 * One side sequential and the other numbered maps sequential to 1..n by appearance
 * (`Hello %s` vs `你好 %1$s`). True mixed strings still compare the two families independently.
 */
export function placeholdersMatch(a: string, b: string): boolean {
  const pa = extractRawPlaceholders(a).map(placeholderKind);
  const pb = extractRawPlaceholders(b).map(placeholderKind);
  const aSeq = pa.filter((k) => k.indexed == null && k.type !== "%%");
  const bSeq = pb.filter((k) => k.indexed == null && k.type !== "%%");
  const aIdx = pa.filter((k) => k.indexed != null);
  const bIdx = pb.filter((k) => k.indexed != null);
  const aPureSeq = aSeq.length > 0 && aIdx.length === 0;
  const bPureSeq = bSeq.length > 0 && bIdx.length === 0;
  const aPureIdx = aIdx.length > 0 && aSeq.length === 0;
  const bPureIdx = bIdx.length > 0 && bSeq.length === 0;
  if ((aPureSeq && bPureIdx) || (aPureIdx && bPureSeq)) {
    const left = aPureSeq ? seqAsIndexed(aSeq) : aIdx;
    const right = bPureSeq ? seqAsIndexed(bSeq) : bIdx;
    return keysEqual(left.map(indexKey), right.map(indexKey));
  }
  if (aSeq.length !== bSeq.length || aIdx.length !== bIdx.length) return false;
  if (!mapsEqual(typeMultiset(aSeq), typeMultiset(bSeq))) return false;
  return keysEqual(aIdx.map(indexKey), bIdx.map(indexKey));
}

/** @deprecated 仅用于调试；比较请走 placeholdersMatch（顺序式不按烘焙编号 sort） */
export function extractPlaceholders(text: string): string[] {
  return extractRawPlaceholders(text)
    .map(placeholderKind)
    .filter((k) => k.type !== "%%")
    .map((k) => (k.indexed ? `%${k.indexed}$${k.type}` : `%${k.type}`))
    .sort();
}
