/**
 * 把已落盘知识文件编进 data/<platform>_<ver>/<source>/<ver>/index-l0.json（幂等按 id 合并）。
 * 从 generate-five-platform-trees 抽出，供一次性脚本与后续手工入库复用。
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * @param {string} repoRoot
 * @param {string} platform
 * @param {string} ver
 * @param {string} source
 * @param {Array<[string, string]>} files [id, repo-relative path]
 */
export function indexKnowledge(repoRoot, platform, ver, source, files) {
  const processed = join(repoRoot, "data", `${platform}_${ver}`, source, ver, "processed");
  mkdirSync(processed, { recursive: true });
  const indexPath = join(repoRoot, "data", `${platform}_${ver}`, source, ver, "index-l0.json");
  let existing = [];
  if (existsSync(indexPath)) {
    try {
      const parsed = JSON.parse(readFileSync(indexPath, "utf8"));
      if (Array.isArray(parsed)) existing = parsed;
    } catch {
      existing = [];
    }
  }
  const byId = new Map(existing.filter((e) => e && typeof e.id === "string").map((e) => [e.id, e]));
  for (const [id, rel] of files) {
    const src = join(repoRoot, rel);
    if (!existsSync(src)) continue;
    const body = readFileSync(src, "utf8");
    const dest = join(processed, `${id}.md`);
    writeFileSync(dest, body, "utf8");
    const entry = {
      id: `${ver}/${id}`,
      version: ver,
      label: id,
      url: rel,
      tags: [platform],
      priority: "⭐",
      sectionCount: 1,
      source,
      fetchedAt: new Date().toISOString(),
    };
    byId.set(entry.id, entry);
  }
  writeFileSync(indexPath, JSON.stringify([...byId.values()], null, 2), "utf8");
}
