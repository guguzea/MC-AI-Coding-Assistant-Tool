#!/usr/bin/env node
/**
 * scripts/_lib/args.js
 * Pure helpers shared by the helper scripts. No I/O, no network — easy to unit-test.
 *
 * - parseCliArgs: tolerate --version=x and --version x; reject empty values.
 * - compareVersions: structured numeric/lexicographic compare suitable for "X.Y.Z"
 *   or "X.Y" or "20.4.237" style version strings. Negative -> a<b, 0 -> ==, positive -> a>b.
 * - isUpdateAvailable: true iff latest > current, treating null/undefined as missing.
 *
 * These helpers never throw on missing input; they return null/NaN to let callers
 * surface errors consistently.
 */

export function parseCliArgs(argv, options = {}) {
  const {
    versionFlag = "--version",
    allowBoolFlags = new Set(["--dry-run"]),
    booleanAliases = new Map(), // e.g. [["--dry-run","--dryRun"]]
  } = options;

  const out = { positional: [], flags: {}, rest: [] };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];

    if (allowBoolFlags.has(a)) {
      out.flags[a.slice(2)] = true;
      continue;
    }

    if (a === versionFlag) {
      const next = argv[i + 1];
      if (next === undefined) {
        out.flags.versionError = "missing-value";
        continue;
      }
      if (next === "" || next.startsWith("--")) {
        out.flags.versionError = "missing-value";
        continue;
      }
      out.flags.version = next;
      i++;
      continue;
    }

    if (a.startsWith(versionFlag + "=")) {
      const v = a.slice(versionFlag.length + 1);
      if (v === "") {
        out.flags.versionError = "empty-value";
        continue;
      }
      out.flags.version = v;
      continue;
    }

    if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      if (eq >= 0) {
        out.flags[a.slice(2, eq)] = a.slice(eq + 1);
      } else {
        // unknown flag with no value: keep as bool true
        out.flags[a.slice(2)] = true;
      }
      continue;
    }

    out.positional.push(a);
  }

  return out;
}

/**
 * Parse a "X.Y.Z" version string into [n, n, n...] of integer (or NaN for non-numeric tail).
 * Trailing non-numeric segments are kept as strings so we still sort correctly when the prefix matches.
 */
export function parseVersion(v) {
  if (v === null || v === undefined) return null;
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  const parts = s.split(/[.\-+_]/);
  return parts.map((p) => {
    if (/^\d+$/.test(p)) return Number(p);
    // mixed like "1.0.0-beta" -> last segment stays as string
    return p;
  });
}

/**
 * Structured compare. Numeric parts compared numerically, string parts lexicographically.
 * Missing parts compare as less than present parts, so "1.20" < "1.20.1".
 * Returns negative if a < b, positive if a > b, 0 if equal.
 */
export function compareVersions(a, b) {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (pa === null && pb === null) return 0;
  if (pa === null) return -1;
  if (pb === null) return 1;
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i];
    const y = pb[i];
    if (x === undefined && y === undefined) continue;
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    if (typeof x === "number" && typeof y === "number") {
      if (x !== y) return x - y;
    } else if (typeof x === "number") {
      // number vs string: numeric precedence (treat string as NaN, larger)
      return -1;
    } else if (typeof y === "number") {
      return 1;
    } else {
      const s = String(x).localeCompare(String(y));
      if (s !== 0) return s;
    }
  }
  return 0;
}

export function isUpdateAvailable(current, latest) {
  if (current === null || current === undefined || current === "") return false;
  if (latest === null || latest === undefined || latest === "") return false;
  return compareVersions(latest, current) > 0;
}
