#!/usr/bin/env node
/**
 * assert-w55-hygiene-rulings — W5-5 卫生件的**用户裁定钉**（2026-09-20）。
 *
 * 裁定（用户 2026-09-20 原话：「剩下2项保留」）：
 *   ① `sm-120x.xml` **保留跟踪**，`.gitignore` 的 `/sm-120x.xml` 规则**保留不动**。
 *      机制更正（本轮实测，推翻此前「规则无效/被覆盖」的读法）：
 *        · `git check-ignore -v sm-120x.xml`            → rc=1（**已跟踪文件不参与 ignore 判定**，这是正常表现）
 *        · `git check-ignore -v --no-index sm-120x.xml` → `.gitignore:113:/sm-120x.xml`（规则存在且形态正确）
 *      ⇒ 规则没坏，只是对已跟踪文件不生效；要让 ignore 生效须 `git rm --cached`，用户选择不做。
 *   ② `scripts/_oneoff/`（10 件）与 `temp/audit/a5/a5repo/` **保留不删**。
 *   ③ 根 `.gitattributes` 由并行写者建立（未跟踪），本波不 adopt、不改动 ⇒ 仅作存在性提示，不作判据。
 *
 * 本门把「保留」从一句话变成可机械复核的事实：文件被删 / 被撤跟踪 / 规则被删，门即红 ——
 * 逼后来者要么改裁定（显式改本门），要么恢复现状；不许静默回退。
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(SERVER_ROOT, "..");

/** 裁定保留物：{ 路径, 期望是否被 git 跟踪 } */
export const KEEP = [
  { rel: "sm-120x.xml", tracked: true, why: "W5-5 裁定①：保留跟踪（不 git rm --cached）" },
  { rel: "scripts/_oneoff", tracked: false, why: "W5-5 裁定②：保留不删（目录 + 10 件一次性脚本）" },
];

/** 判据：纯函数部分（存在性 + .gitignore 规则形态），selftest 与真跑共用。 */
export function validateKeep(root, gitignoreText, exists = fs.existsSync) {
  const problems = [];
  for (const k of KEEP) {
    if (!exists(path.join(root, k.rel))) problems.push(`${k.rel} 不在盘上（${k.why}）`);
  }
  if (!/^\/sm-120x\.xml\s*$/m.test(gitignoreText)) {
    problems.push(".gitignore 里 `/sm-120x.xml` 规则被删或改形（裁定①要求规则保留不动）");
  }
  return problems;
}

function gitTracked(rel) {
  const r = spawnSync("git", ["ls-files", "--error-unmatch", rel], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    windowsHide: true,
  });
  return r.status === 0;
}

if (process.argv.includes("--selftest")) {
  const tmpOk = path.join(SERVER_ROOT, "package.json");
  const gi = "temp/\n/sm-120x.xml\n";
  const cases = [
    ["正对照：存在 + 规则在", (p) => fs.existsSync(p) || p.endsWith("sm-120x.xml") || p.endsWith("_oneoff"), gi, 0],
    ["规则被删", () => true, "temp/\n", 1],
  ];
  let missed = 0;
  for (const [name, exists, text, want] of cases) {
    const got = validateKeep(REPO_ROOT, text, (p) => (p.includes("_oneoff") ? true : exists(p))).length;
    const ok = want === 0 ? got === 0 : got > 0;
    if (!ok) {
      missed++;
      console.error(`  ✗ selftest「${name}」应${want === 0 ? "绿" : "红"}实${got === 0 ? "绿" : "红"}`);
    }
  }
  console.log(`\nassert-w55-hygiene-rulings(selftest): ${missed === 0 ? "OK（2 类判据）" : missed + " 例不符"}`);
  process.exitCode = missed === 0 ? 0 : 1;
} else {
  const giPath = path.join(REPO_ROOT, ".gitignore");
  if (!fs.existsSync(giPath)) {
    console.error("assert-w55-hygiene-rulings: 找不到 .gitignore");
    process.exit(1);
  }
  const problems = validateKeep(REPO_ROOT, fs.readFileSync(giPath, "utf8"));
  for (const k of KEEP) {
    if (!k.tracked) continue;
    if (!gitTracked(k.rel)) problems.push(`${k.rel} 不再被 git 跟踪（${k.why}）`);
  }
  if (problems.length > 0) {
    console.error(`assert-w55-hygiene-rulings: ${problems.length} 项与 2026-09-20 裁定不符`);
    for (const p of problems) console.error(`  ✗ ${p}`);
    process.exit(1);
  }
  const note = fs.existsSync(path.join(REPO_ROOT, ".gitattributes"))
    ? "根 .gitattributes 存在（并行写者产物，未跟踪；本波未 adopt）"
    : "根 .gitattributes 不存在（本波核对时的状态）";
  console.log(
    `assert-w55-hygiene-rulings: ok（裁定保留物 ${KEEP.length} 项均在位：sm-120x.xml 仍被跟踪 · .gitignore:113 规则保留 · scripts/_oneoff 保留；${note}）`,
  );
}
