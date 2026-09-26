#!/usr/bin/env node
/**
 * 门：`node --test` 链必须覆盖盘上全部 `*.test.mjs`（A8；2026-09-24）。
 *
 * 为什么要有它（无门面）：`mcp-server/scripts/**` 下的 `.test.mjs` 只有被 package.json
 * `test` 链里 `node --test …` 段点名，才会随 `npm test` 真的跑；新加一个测试文件忘了接线
 * ⇒ 它永远「绿」但从未运行过（与 test-decompile 那批 async 死断言同族：缺陷不在断言而在**没人跑**）。
 *
 * 判据（两个方向都判；只扫盘 + 读 package.json，**不抄台账**）：
 *   ① 盘上 `mcp-server/scripts/**\/*.test.mjs` 有、链上没点名 ⇒ 红（存在但没人跑）
 *   ② 链上 `node --test` 段点名的 `.mjs` 不在盘上 ⇒ 红（点名了空气）
 *
 * ⚠️ 与 `assert-scripts-parse.mjs` 的 test-wiring 腿的分工（2026-09-24 A8 回修②）：
 *   那条腿是**单向下界**（只判①且按 basename 比，刻意不判②以免变成等式棘轮），挂 `npm test` 第一道；
 *   本门是**双向权威**（按仓库相对路径比），挂 `test-scripts.mjs` 两条数组。两者方向不同、判据不重复；
 *   冲突时以本门为准，**不要在 parse 门里再抄一份双向实现**（两个真值源必然漂）。
 *
 * 用法：
 *   node scripts/assert-test-chain-coverage.mjs                # 判真仓库（默认）
 *   node scripts/assert-test-chain-coverage.mjs --selftest     # 临时树三态投毒（绿 / ①红 / ②红）
 *   node scripts/assert-test-chain-coverage.mjs --root=<dir>   # 指向别处（selftest 用）
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARGV = process.argv.slice(2);
const SELFTEST = ARGV.includes("--selftest");
function argVal(name) {
  const hit = ARGV.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
}
/** 真仓库根 = mcp-server/scripts 的上两级；selftest 用 --root 指向临时树。 */
const ROOT = path.resolve(argVal("root") ?? path.join(HERE, "..", ".."));

export function walkTests(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === "dist" || e.name === ".git") continue;
      walkTests(path.join(dir, e.name), out);
      continue;
    }
    if (e.isFile() && e.name.endsWith(".test.mjs")) out.push(path.join(dir, e.name));
  }
  return out;
}

/** 盘上测试文件（仓库相对路径，正斜杠） */
export function diskTests(root) {
  const scanDir = path.join(root, "mcp-server", "scripts");
  return walkTests(scanDir)
    .map((abs) => path.relative(root, abs).split(path.sep).join("/"))
    .sort();
}

/** 链上 `node --test` 段点名的文件（仓库相对路径，正斜杠）。链文件缺失/无 test 脚本 → null（调用方报红）。 */
export function chainRefs(root) {
  const pkgPath = path.join(root, "mcp-server", "package.json");
  if (!fs.existsSync(pkgPath)) return null;
  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  } catch {
    return null;
  }
  const script = pkg?.scripts?.test;
  if (typeof script !== "string" || !script.trim()) return null;
  const refs = new Set();
  for (const m of script.matchAll(/node\s+--test\s+([^&|]*)/g)) {
    for (const f of m[1].matchAll(/(\S+\.mjs)/g)) {
      refs.add(path.posix.join("mcp-server", f[1].replace(/\\/g, "/")));
    }
  }
  return [...refs].sort();
}

/**
 * 双向判据。返回 { problems, onDisk, onChain }。
 * 说明：链上 `node --test` 段里非 test 的辅助文件（如 `scripts/_lib/test-helpers.mjs`）
 * 只参与判据②（必须存在），不参与判据①（不要求盘上每个 .mjs 都进链）。
 */
export function run(root) {
  const problems = [];
  const onDisk = diskTests(root);
  const chain = chainRefs(root);
  if (chain === null) {
    return {
      problems: ["mcp-server/package.json 缺失 / 不可解析 / test 脚本为空 ⇒ 覆盖判据无从谈起（不是「通过」）"],
      onDisk,
      onChain: null,
    };
  }
  const chainSet = new Set(chain);
  const diskSet = new Set(onDisk);
  for (const t of onDisk) {
    if (!chainSet.has(t)) problems.push(`① ${t} 在盘上但链上没点名 ⇒ 该测试不会随 npm test 跑（接线后再提交）`);
  }
  for (const c of chain) {
    if (!fs.existsSync(path.join(root, c))) problems.push(`② 链上点名了不存在的 ${c} ⇒ node --test 会直接报错或被静默跳过`);
  }
  void diskSet;
  return { problems, onDisk, onChain: chain };
}

if (SELFTEST) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "testchain-"));
  let fails = 0;
  const put = (rel, content) => {
    const abs = path.join(tmp, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, "utf8");
  };
  const pkgWith = (testScript) => JSON.stringify({ name: "x", scripts: { test: testScript } }, null, 2);
  const cases = [
    {
      name: "盘上 {a} / 链上 {a} → 绿",
      setup: () => {
        put("mcp-server/scripts/_lib/a.test.mjs", "");
        put("mcp-server/package.json", pkgWith("node --test scripts/_lib/a.test.mjs && node test-core.mjs"));
      },
      wantProblems: 0,
      wantMentions: [],
    },
    {
      name: "盘上 {a,b} / 链上 {a} → ①红且点名 b",
      setup: () => {
        put("mcp-server/scripts/_lib/a.test.mjs", "");
        put("mcp-server/scripts/_lib/b.test.mjs", "");
        put("mcp-server/package.json", pkgWith("node --test scripts/_lib/a.test.mjs"));
      },
      wantProblems: 1,
      wantMentions: ["b.test.mjs"],
    },
    {
      name: "盘上 {a} / 链上 {a,c} → ②红且点名 c",
      setup: () => {
        put("mcp-server/scripts/_lib/a.test.mjs", "");
        put("mcp-server/package.json", pkgWith("node --test scripts/_lib/a.test.mjs scripts/_lib/c.test.mjs"));
      },
      wantProblems: 1,
      wantMentions: ["c.test.mjs"],
    },
    {
      name: "非 test 辅助件点名但缺失 → ②红（点名空气）",
      setup: () => {
        put("mcp-server/scripts/_lib/a.test.mjs", "");
        put("mcp-server/package.json", pkgWith("node --test scripts/_lib/a.test.mjs scripts/_lib/helpers.mjs"));
      },
      wantProblems: 1,
      wantMentions: ["helpers.mjs"],
    },
    {
      name: "package.json 缺 test 脚本 → 红（不许当通过）",
      setup: () => {
        put("mcp-server/scripts/_lib/a.test.mjs", "");
        put("mcp-server/package.json", JSON.stringify({ name: "x", scripts: {} }, null, 2));
      },
      wantProblems: 1,
      wantMentions: ["package.json"],
    },
  ];
  for (const c of cases) {
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.mkdirSync(tmp, { recursive: true });
    c.setup();
    const r = run(tmp);
    const mentioned = c.wantMentions.every((m) => r.problems.some((p) => p.includes(m)));
    const ok = r.problems.length === c.wantProblems && mentioned;
    if (!ok) fails += 1;
    console.log(`${ok ? "PASS" : "FAIL"}  ${c.name}  实际红=${r.problems.length} 期望=${c.wantProblems}`);
    if (!ok) console.log("      " + (r.problems.join("\n      ") || "(无问题)"));
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(fails ? `selftest FAILED（${fails}/${cases.length}）` : `selftest OK（${cases.length}/${cases.length}）`);
  process.exit(fails ? 1 : 0);
}

const res = run(ROOT);
if (res.problems.length) {
  console.error(`assert-test-chain-coverage: ${res.problems.length} 项不通过（盘上测试 ${res.onDisk.length} 个 / 链上点名 ${res.onChain?.length ?? 0} 个）`);
  for (const p of res.problems) console.error("  " + p);
  process.exit(1);
}
console.log(
  `assert-test-chain-coverage: ok（盘上测试 ${res.onDisk.length} 个，链上点名 ${res.onChain.length} 个，双向差集 0）`,
);
