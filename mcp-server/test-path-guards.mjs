/**
 * 路径守卫单测（2026-10-30）：
 *  - realOfNearestExistingAncestor：父目录缺失不得 ENOENT 抛穿；
 *  - playtest_intent：证据目录与其父目录都不存在时走结构化三态，不抛；
 *  - commonAncestorOfDirs：多客户端跨父目录时 marker 根是真正的公共祖先（不是 parents[0]）；
 *  - isInsideExtractRoot：大小写归一只在 Windows（POSIX 上 /tmp/abc 与 /tmp/ABC/x 是两棵树）；
 *  - resolveCommunityDir：`..` 片段不得穿出 community_knowledge。
 */
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SERVER = join(dirname(fileURLToPath(import.meta.url)), ".");
const dist = (rel) => pathToFileURL(join(SERVER, "dist", rel)).href;

const { realOfNearestExistingAncestor } = await import(dist("utils/project-sandbox.js"));
const { isInsideExtractRoot } = await import(dist("utils/extract-verify.js"));
const { commonAncestorOfDirs } = await import(dist("playtest-multi/index.js"));
const { playtestIntent } = await import(dist("playtest-intent/index.js"));
const { resolveCommunityDir } = await import(dist("utils/path.js"));

const tmp = mkdtempSync(join(tmpdir(), "mc-skill-path-guards-"));
const prev = {
  allow: process.env.MC_SKILL_PLAYTEST_ALLOW,
  root: process.env.MC_SKILL_PLAYTEST_ROOT,
  community: process.env.MC_SKILL_COMMUNITY,
};
try {
  // 1) realOfNearestExistingAncestor：深层不存在也能解析到存在的祖先 + 尾段
  const deep = join(tmp, "no-such-a", "no-such-b", "leaf");
  assert.ok(
    realOfNearestExistingAncestor(deep).endsWith(join("no-such-a", "no-such-b", "leaf")),
    "尾段必须原样拼回（祖先 realpath 的大小写由平台决定）",
  );

  // 2) playtest_intent：目录与父目录都不存在 ⇒ 结构化三态（不得抛 ENOENT）
  process.env.MC_SKILL_PLAYTEST_ALLOW = "1";
  process.env.MC_SKILL_PLAYTEST_ROOT = tmp;
  const read = playtestIntent({ action: "read", evidenceDir: deep });
  assert.equal(read.ok, true, `缺父目录的 read 必须结构化返回，实际 ${JSON.stringify(read).slice(0, 300)}`);
  assert.equal(read.state?.state, "absent");
  assert.equal(read.menu?.state, "absent");

  // 授权根外：同样的缺父目录路径也要先被围栏拦住
  const outside = join(tmpdir(), `mc-skill-path-outside-${process.pid}`, "deep", "evidence");
  const out = playtestIntent({ action: "read", evidenceDir: outside });
  assert.equal(out.code, "PATH_OUTSIDE_ALLOWLIST", `授权根外必须拒绝，实际 ${out.code ?? "(none)"}`);

  // 3) 公共祖先：跨父目录取真正公共祖先；单客户端仍取父目录
  const a = join(tmp, "projA", "evidence", "c1");
  const b = join(tmp, "projB", "evidence", "c2");
  assert.equal(commonAncestorOfDirs([dirname(a), dirname(b)]), tmp);
  assert.equal(commonAncestorOfDirs([dirname(a)]), join(tmp, "projA", "evidence"));
  if (process.platform === "win32") {
    assert.equal(commonAncestorOfDirs(["C:\\x\\a", "D:\\y\\b"]), null, "跨盘必须返回 null（不得给出 C:\\sync）");
  } else {
    assert.equal(commonAncestorOfDirs(["/a/x", "/b/y"]), "/");
  }

  // 4) 解压树根：大小写是否归一由平台决定
  const root = join(tmp, "abc");
  const siblingDifferentCase = join(tmp, "ABC", "x");
  assert.equal(isInsideExtractRoot(root, siblingDifferentCase, true), true, "Windows 口径：大小写不敏感");
  assert.equal(isInsideExtractRoot(root, siblingDifferentCase, false), false, "POSIX 口径：仅大小写不同是树外");

  // 5) community 围栏
  const community = join(tmp, "community");
  mkdirSync(join(community, "authored"), { recursive: true });
  process.env.MC_SKILL_COMMUNITY = community;
  assert.equal(resolveCommunityDir("authored", "lib-caelus.md"), join(community, "authored", "lib-caelus.md"));
  assert.throws(() => resolveCommunityDir("..", "escape"), /逃出 community_knowledge/);
  assert.throws(() => resolveCommunityDir("authored/../../escape"), /逃出 community_knowledge/);
} finally {
  for (const [k, v] of [
    ["MC_SKILL_PLAYTEST_ALLOW", prev.allow],
    ["MC_SKILL_PLAYTEST_ROOT", prev.root],
    ["MC_SKILL_COMMUNITY", prev.community],
  ]) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  rmSync(tmp, { recursive: true, force: true });
}

console.log("test-path-guards: ok (5 族)");
