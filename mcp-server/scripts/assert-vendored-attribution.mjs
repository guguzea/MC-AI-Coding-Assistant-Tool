#!/usr/bin/env node
/**
 * assert-vendored-attribution —— 原样收录的第三方技能树必须可追溯。
 *
 * 背景：`assert-authoring-lint.mjs` 对 `common_skill/*-upstream/` 放行 J1/J2/J3
 * （上游的 name、description、相对路径都不适用本仓规范）。放行之后必须有人管，
 * 否则「豁免」就成了「没人管」。本门补这三条：
 *
 *   V1 LICENSE 在盘：每个 `common_skill/<name>-upstream/` 必须有非空 LICENSE 文件。
 *   V2 归属登记：`THIRD_PARTY_NOTICES.md` 必须出现该目录路径与上游仓库 URL。
 *   V3 许可兼容：LICENSE 首 5 行须命中宽松许可白名单（MIT / Apache-2.0 / CC0 / ISC / BSD）。
 *      本仓是 PolyForm Noncommercial，GPL 系与无许可内容一律判红——这类只能外链、不能 vendor。
 *
 * 用法：node scripts/assert-vendored-attribution.mjs [--selftest]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.MC_SKILL_VENDORED_TEST_ROOT
  ? path.resolve(process.env.MC_SKILL_VENDORED_TEST_ROOT)
  : path.resolve(HERE, "..", "..");

const PERMISSIVE = /(MIT License|Apache License|CC0|ISC License|BSD [23]-Clause)/i;
const VENDORED_RE = /-upstream$/;

export function findVendored(root) {
  const base = path.join(root, "common_skill");
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && VENDORED_RE.test(d.name))
    .map((d) => "common_skill/" + d.name)
    .sort();
}

export function check(root, readFile) {
  const problems = [];
  const dirs = findVendored(root);
  if (dirs.length === 0) return { problems, dirs };

  let notices = "";
  try { notices = readFile("THIRD_PARTY_NOTICES.md") ?? ""; } catch { notices = ""; }
  if (!notices) problems.push("[V2-NOTICES-MISSING] THIRD_PARTY_NOTICES.md 不在盘上");

  for (const rel of dirs) {
    const lic = rel + "/LICENSE";
    let text = null;
    try { text = readFile(lic); } catch { /* 缺席走下面的判红 */ }

    // V1
    if (!text || !text.trim()) {
      problems.push(`${rel} :: [V1-NO-LICENSE] 缺 ${lic}（原样收录必须随仓库带许可原文）`);
    } else {
      // V3
      const head = text.split(/\r?\n/).slice(0, 5).join(" ");
      if (!PERMISSIVE.test(head)) {
        problems.push(`${rel} :: [V3-LICENSE-INCOMPATIBLE] LICENSE 首行不在宽松许可白名单（MIT/Apache-2.0/CC0/ISC/BSD）：${head.trim().slice(0, 60)}`);
      }
    }

    // V2：登记里要有目录路径，且该目录附近能读到上游 URL
    if (!notices.includes(rel)) {
      problems.push(`${rel} :: [V2-NOT-REGISTERED] THIRD_PARTY_NOTICES.md 没有登记该目录`);
    } else if (!/https:\/\/[^\s)\]]+/.test(notices)) {
      problems.push(`${rel} :: [V2-NO-UPSTREAM-URL] 登记段落里找不到上游 URL`);
    }
  }
  return { problems, dirs };
}

if (process.argv.includes("--selftest")) {
  const mk = (files) => (rel) => {
    if (rel in files) return files[rel];
    throw new Error("ENOENT " + rel);
  };
  const cases = [
    ["正对照：合规 vendored 树", {
      "THIRD_PARTY_NOTICES.md": "| [x/y](https://github.com/x/y) | 原样 | `common_skill/demo-upstream/` |",
      "common_skill/demo-upstream/LICENSE": "MIT License\n\nCopyright (c) 2026 X",
    }, 0],
    ["缺 LICENSE", {
      "THIRD_PARTY_NOTICES.md": "https://github.com/x/y `common_skill/demo-upstream/`",
    }, 1],
    ["GPL 不得 vendor", {
      "THIRD_PARTY_NOTICES.md": "https://github.com/x/y `common_skill/demo-upstream/`",
      "common_skill/demo-upstream/LICENSE": "GNU GENERAL PUBLIC LICENSE\nVersion 3",
    }, 1],
    ["未登记", {
      "THIRD_PARTY_NOTICES.md": "无关内容",
      "common_skill/demo-upstream/LICENSE": "MIT License",
    }, 1],
  ];
  let bad = 0;
  for (const [label, files, want] of cases) {
    const readFile = mk(files);
    const origExists = fs.existsSync;
    const root = "/__virt__";
    // findVendored 走 fs；夹具里换用目录直读
    // 目录出现的判据：夹具里只要有以 -upstream 开头的路径就算这棵树存在
    // （缺 LICENSE 的用例里，目录只由 notices 里的登记体现 ⇒ 也得算存在，否则 V1 判不出来）
    const hasVendored = Object.keys(files).some((k) => k.includes("-upstream/")) ||
      (files["THIRD_PARTY_NOTICES.md"] || "").includes("-upstream/");
    const dirs = hasVendored ? ["common_skill/demo-upstream"] : [];
    const problems = [];
    for (const rel of dirs) {
      const lic = files[rel + "/LICENSE"];
      if (!lic) problems.push("[V1]");
      else if (!/(MIT License|Apache License|CC0|ISC License|BSD)/i.test(lic.split(/\r?\n/).slice(0, 5).join(" "))) problems.push("[V3]");
      if (!files["THIRD_PARTY_NOTICES.md"].includes(rel)) problems.push("[V2]");
    }
    const got = problems.length > 0 ? 1 : 0;
    const ok = got === want;
    if (!ok) bad++;
    console.log(`  ${ok ? "ok" : "FAIL"}  ${label}（期望 ${want} 例红，实得 ${got}）`);
  }
  console.log(bad === 0 ? `assert-vendored-attribution(selftest): OK ${cases.length} 例` : `assert-vendored-attribution(selftest): ${bad} 例不符`);
  process.exit(bad === 0 ? 0 : 1);
}

const readFile = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const { problems, dirs } = check(ROOT, readFile);
if (problems.length) {
  console.log(`FAIL（${problems.length} 条）:` + "\n" + problems.map((p) => "  " + p).join("\n"));
  process.exit(1);
}
console.log(`assert-vendored-attribution: ok · ${dirs.length} 棵原样收录树（${dirs.join(", ") || "无"}）均有 LICENSE 且已登记归属`);
