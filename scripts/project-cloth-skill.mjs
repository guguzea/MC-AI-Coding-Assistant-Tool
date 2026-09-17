/**
 * mc-cloth-config 版本注入点（2026-09-16 裁定：保留中心稿 + 加投影版本注入点）。
 *
 * 源：`knowledge/libs/fabric-only/mc-cloth-config/versions.json`（档位坐标真值；改坐标先改这里再重投影）。
 * 目标：`fabric/<v>/.cursor/skills/mc-cloth-config.md` frontmatter 后的**注入标记行**：
 *   `<!-- cloth-version-inject v=<档> coord=<串> state=<active|commented|todo> textApi=<literal|constructor> -->`
 *
 * 边界（刻意收窄）：中心稿 SKILL.md 是通用形权威；档内正文是已逐档修正的实况（S41-b 2026-09-14 落地），
 * 本脚本**只管理注入标记行**，不重写正文、不碰其他字节；EOL 逐文件保持。
 * 默认 --check（校验）；--write 才插入/更新（走 write-guard emit）。退出码：全一致 0，否则 1（可串门禁）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { emit, wantWrite, logDryRunBanner } from "./_lib/write-guard.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const SRC = path.join(REPO, "knowledge", "libs", "fabric-only", "mc-cloth-config", "versions.json");
const VERS = ["1.14.4", "1.16.5", "1.17.1", "1.18.2", "1.19.4", "1.20.1", "1.20.4", "1.21.1", "1.21.3", "1.21.11"];
const RE_INJECT = /^<!-- cloth-version-inject [^\n]*\r?\n/m;

const data = JSON.parse(fs.readFileSync(SRC, "utf8"));
if (!wantWrite()) logDryRunBanner("project-cloth-skill");

let bad = 0;
for (const v of VERS) {
  const slot = data.slots[v];
  if (!slot) { console.log(`${v}: versions.json 缺档位`); bad++; continue; }
  if (!slot.coord || !slot.state || !slot.textApi) { console.log(`${v}: versions.json 槽位字段不全`); bad++; continue; }
  const p = path.join(REPO, "fabric", v, ".cursor", "skills", "mc-cloth-config.md");
  if (!fs.existsSync(p)) { console.log(`${v}: 手稿不存在 ${path.relative(REPO, p)}`); bad++; continue; }
  const t = fs.readFileSync(p, "utf8");
  const fm = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(t);
  if (!fm) { console.log(`${v}: frontmatter 解析失败`); bad++; continue; }
  const want = `<!-- cloth-version-inject v=${v} coord=${slot.coord} state=${slot.state} textApi=${slot.textApi} -->`;
  const head = fm[0];
  const rest = t.slice(head.length);
  const cur = RE_INJECT.exec(rest);
  if (cur) {
    const curLine = cur[0].replace(/\r?\n$/, "");
    if (curLine === want) { console.log(`${v}: OK`); continue; }
    bad++;
    if (wantWrite()) {
      const eol = t.includes("\r\n") ? "\r\n" : "\n";
      emit(p, head + want + eol + rest.slice(cur[0].length));
      console.log(`${v}: UPDATED`);
    } else {
      console.log(`${v}: MISMATCH 现有=${curLine}`);
      console.log(`${v}:          期望=${want}`);
    }
  } else {
    bad++;
    if (wantWrite()) {
      const eol = t.includes("\r\n") ? "\r\n" : "\n";
      emit(p, head + want + eol + rest);
      console.log(`${v}: INSERTED`);
    } else {
      console.log(`${v}: MISSING（--write 可插入）`);
    }
  }
}
console.log(bad === 0 ? "check: 10 档全部一致" : `check: ${bad} 档待处理`);
process.exit(bad === 0 ? 0 : 1);
