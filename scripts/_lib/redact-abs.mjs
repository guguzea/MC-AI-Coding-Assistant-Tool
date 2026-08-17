/**
 * 把本机绝对路径收成 $MC_SKILL_CACHE / 仓库相对路径，避免 last-run JSON 入库带盘符。
 */
export function redactAbs(value, { cache, repo } = {}) {
  if (value == null) return value;
  if (Array.isArray(value)) return value.map((v) => redactAbs(v, { cache, repo }));
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = redactAbs(v, { cache, repo });
    return out;
  }
  if (typeof value !== "string") return value;
  const norm = (p) => String(p).replace(/\\/g, "/").replace(/\/+$/, "");
  const s = value.replace(/\\/g, "/");
  const c = cache ? norm(cache) : "";
  const r = repo ? norm(repo) : "";
  if (c && s.toLowerCase().startsWith(c.toLowerCase())) {
    return `$MC_SKILL_CACHE${s.slice(c.length)}`;
  }
  if (r && s.toLowerCase().startsWith(r.toLowerCase())) {
    return s.slice(r.length).replace(/^\//, "");
  }
  if (/^[A-Za-z]:\//.test(s) || s.startsWith("//")) return "[redacted-abs]";
  return value;
}
