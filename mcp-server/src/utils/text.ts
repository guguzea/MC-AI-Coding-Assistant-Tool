/**
 * UTF-8 BOM 与 YAML fence 辅助（V10H1）。
 */

/** 去掉 UTF-8 BOM（U+FEFF），避免 `startsWith("---")` 误判。 */
export function stripUtf8Bom(text: string): string {
  if (!text) return text;
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

/** 第一对 `---` 是 banner 注记而非 YAML frontmatter。 */
export function looksLikeBannerFence(fm: string): boolean {
  return /\[FORGE_COMPAT|\[QSL_OVERLAY|\[BANNER\]/.test(fm);
}

export type YamlFenceMatch = { full: string; inner: string };

/** 匹配文本开头的一对 `---` fence（空 fence 优先于把中间 `---` 当 inner）。 */
export function matchLeadingFence(text: string): YamlFenceMatch | null {
  const empty = text.match(/^---\r?\n---\r?\n?/) || text.match(/^---\r?\n[ \t]*\r?\n---\r?\n?/);
  if (empty) return { full: empty[0], inner: "" };
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return null;
  return { full: m[0], inner: m[1] ?? "" };
}

export function isSkippableFenceInner(inner: string): boolean {
  return inner.trim() === "" || looksLikeBannerFence(inner);
}

/**
 * 从开头走 `---` 对：跳过空 inner / banner fence，返回下一对真实 YAML。
 * `skipped` 为被跳过的前缀；无真实 YAML 时 `fence` 为 null，`rest` 为去掉 skipped 后的剩余。
 */
export function nextRealYamlFence(text: string): {
  skipped: string;
  fence: YamlFenceMatch | null;
  rest: string;
} {
  let skipped = "";
  let rest = text;
  while (true) {
    const m = matchLeadingFence(rest);
    if (!m) return { skipped, fence: null, rest };
    if (isSkippableFenceInner(m.inner)) {
      skipped += m.full;
      rest = rest.slice(m.full.length);
      continue;
    }
    return { skipped, fence: m, rest: rest.slice(m.full.length) };
  }
}
