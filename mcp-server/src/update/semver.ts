/**
 * Lightweight semver (+ prerelease) compare for release tags.
 */

export interface ParsedSemver {
  major: number;
  minor: number;
  patch: number;
  prerelease: string[];
  raw: string;
}

export function stripV(tag: string): string {
  return tag.trim().replace(/^v/i, "");
}

export function looksLikePrereleaseTag(tag: string): boolean {
  const t = stripV(tag).toLowerCase();
  if (t.includes("-")) return true;
  return /\b(alpha|beta|rc|pre|preview|snapshot)\b/.test(t);
}

/** Parse 1.2.3, 1.2.3-alpha.1, etc. Returns null if not semver-like. */
export function parseSemver(tag: string): ParsedSemver | null {
  const raw = stripV(tag);
  const m = raw.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/);
  if (!m) return null;
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    prerelease: m[4] ? m[4].split(".") : [],
    raw,
  };
}

function cmpIdent(a: string, b: string): number {
  const an = /^\d+$/.test(a);
  const bn = /^\d+$/.test(b);
  if (an && bn) return Number(a) - Number(b);
  if (an && !bn) return -1;
  if (!an && bn) return 1;
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Negative if a<b, 0 if equal, positive if a>b. null if either unparsable. */
export function compareSemver(a: string, b: string): number | null {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  if (!pa || !pb) return null;
  if (pa.major !== pb.major) return pa.major - pb.major;
  if (pa.minor !== pb.minor) return pa.minor - pb.minor;
  if (pa.patch !== pb.patch) return pa.patch - pb.patch;
  if (pa.prerelease.length === 0 && pb.prerelease.length === 0) return 0;
  if (pa.prerelease.length === 0) return 1; // release > prerelease
  if (pb.prerelease.length === 0) return -1;
  const n = Math.max(pa.prerelease.length, pb.prerelease.length);
  for (let i = 0; i < n; i++) {
    if (i >= pa.prerelease.length) return -1;
    if (i >= pb.prerelease.length) return 1;
    const c = cmpIdent(pa.prerelease[i], pb.prerelease[i]);
    if (c !== 0) return c;
  }
  return 0;
}

/**
 * True if remote is newer than local.
 * Unparsable: string inequality (and remote not filtered as prerelease elsewhere).
 */
export function isNewer(remoteTag: string, localVersion: string): boolean {
  const cmp = compareSemver(remoteTag, localVersion);
  if (cmp !== null) return cmp > 0;
  return stripV(remoteTag) !== stripV(localVersion);
}

export type GitDescribeVsRemote = "ahead" | "equal" | "behind" | "unknown";

/**
 * Compare `git describe --tags --always` with a remote release tag.
 * `V1.0.4-12-gabcdef` is ahead of `V1.0.4`; exact tag is equal.
 */
export function gitDescribeVsRemote(
  describe: string | undefined,
  remoteTag: string,
): GitDescribeVsRemote {
  if (!describe?.trim() || !remoteTag?.trim()) return "unknown";
  const d = describe.trim();

  const describeMatch = d.match(/^(.*)-(\d+)-g[0-9a-f]+$/i);
  if (describeMatch) {
    const tagPart = describeMatch[1];
    const commits = Number(describeMatch[2]);
    const cmp = compareSemver(tagPart, remoteTag);
    if (cmp === null) return "unknown";
    if (cmp > 0) return "ahead";
    if (cmp < 0) return "behind";
    return commits > 0 ? "ahead" : "equal";
  }

  const cmp = compareSemver(d, remoteTag);
  if (cmp === null) return "unknown";
  if (cmp > 0) return "ahead";
  if (cmp === 0) return "equal";
  return "behind";
}
