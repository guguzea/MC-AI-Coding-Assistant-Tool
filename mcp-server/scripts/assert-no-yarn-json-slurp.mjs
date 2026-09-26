/**
 * Static gate: runtime src must never slurp yarn-mappings.json.
 *
 * MC_SKILL_YARN_SLURP_GATE_SRC：只给「证明本 gate 真的会失败」的自检用——把被扫目录换成
 * 一个假 src（里面是被改坏的副本）。真实跑不设它。
 *
 * S16-4（2026-09-24）把注释豁免补成真存在：下面那句「Allow comments that mention the ban」此前
 * **没有实现** —— 只有 `yarn-sqlite.ts/js` 被特赦，别的 src 文件里一行
 * `// 不要 readFileSync yarn-mappings.json` 的注释就能让门 exit 1（假红 ⇒ 下一手就是删注释，
 * 正是静默绿的温床）。现口径：
 *   · **整行注释**（trim 后以 `//` / `/*` / `*` 起头）里的提及一律不判；
 *   · **行尾注释仍判红** —— 判据只看「非整行注释」拼起来的 codeOnly，把路径挂在代码行尾的照红
 *     （宁可假红，不可假绿）。
 * 同轮补 R47 地板：换根钩子指错目录 ⇒ `walk()` 采到 0 文件时此前照样 ok + exit 0；现在「扫到 0 个
 * .ts/.js/.mjs = 换错根 ≠ 零缺陷」直接红，并把「扫了几 / 豁免了几 / 拒了几」同屏打出。
 *
 * S16/T8（第 27 轮）补**自带** `--selftest`：上面那些判据此前只有 `test-scripts.mjs` §#16 从**外面**
 * 投毒（写盘到 `mcp-server/_debug_gate_selftest/`，且只投两种 slurp 形态）。本门现在自己在内存里
 * 投 5 记（含 1 记不判对照 + 1 记 COLLECTOR_RETURNED_ZERO），**不落盘**，形状同
 * `assert-community-attribution.mjs` 的 `evaluate(accessor)`：真跑与自检共用同一份 `evaluateSlurp`，
 * 不留第二个判据真值源。
 *
 * 用法：
 *   node scripts/assert-no-yarn-json-slurp.mjs            # 真跑（扫 src/）
 *   node scripts/assert-no-yarn-json-slurp.mjs --selftest # 判据活性自证（内存夹具，不写盘）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FORBIDDEN = [
  /yarn-mappings\.json/,
  // 只钉 JSON：本 gate 防的是把 data/fabric_*/mappings/yarn-mappings.json（实测 25.8MB →
  // 解析成对象再翻几倍）读进运行时。反编译链路里 readFileSync 一个 yarn **jar**（实测
  // mergedv2 1.3MB）是正常且必要的，不在禁止范围内。
  /readFileSync\s*\([^)]*yarn[^)]*json/i,
  /readFile\s*\([^)]*yarn-mappings/i,
  /JSON\.parse\s*\([^)]*yarn/i,
];

/** 整行注释（含块注释的 ` * ...` 续行）：豁免「只是提到禁令/路径」的诊断性说明。 */
const COMMENT_ONLY_LINE = /^\s*(?:\/\/|\/\*|\*)/;

/** 唯一被特赦的文件（它要在报错文案里点名那个 json 路径）；按 rel 的 basename 判，与旧 endsWith(sep+…) 同集合。 */
const EXEMPT_FILE = /(^|\/)yarn-sqlite\.(ts|js)$/;

/**
 * 纯判据：files = [{ label, rel, text }] ⇒ { scanned, hits, commentExempted, errors }。
 * 不打印、不退出、不碰盘 ⇒ 真跑与 `--selftest` 共用这一份。
 * `errors` 只放「采集器失效」这一类地板；hits 是缺陷、commentExempted 是记账。
 */
export function evaluateSlurp(files) {
  const errors = [];
  // R47 地板：采集面 0 不是「零缺陷」，是「扫错了根」（换根钩子 MC_SKILL_YARN_SLURP_GATE_SRC 写错就长这样）。
  if (files.length === 0) {
    errors.push("COLLECTOR_RETURNED_ZERO: 采集面 0 个 .ts/.js/.mjs ⇒ 换错根，判不了（拒）");
  }
  const hits = [];
  const commentExempted = [];
  for (const { label, rel, text } of files) {
    const codeOnly = stripCommentLines(text);
    // Allow comments that mention the ban / path — but only whole-line comments, and only if they don't load
    for (const re of FORBIDDEN) {
      if (re.test(text) && !re.test(codeOnly)) {
        commentExempted.push(`${label} :: ${String(re)}`);
        continue;
      }
      if (!re.test(codeOnly)) continue;
      // Allow yarn-sqlite.ts to mention the filename in error strings / comments
      // but not call readFile* on it.
      if (EXEMPT_FILE.test(rel)) {
        if (/readFileSync|readFile\s*\(|JSON\.parse/.test(codeOnly) && /yarn-mappings\.json/.test(codeOnly)) {
          // error message strings may mention the json path — ensure no actual load API near it
          const loadCall = /(?:readFileSync|readFile|JSON\.parse)\s*\(\s*[^)]*yarn-mappings\.json/;
          if (loadCall.test(codeOnly)) hits.push({ label, rel, re: String(re) });
        }
        continue;
      }
      hits.push({ label, rel, re: String(re) });
    }
  }
  return { scanned: files.length, hits, commentExempted, errors };
}

/** 去掉整行注释，只留代码行（行尾注释留在原行里 ⇒ 仍会被判，见文件头）。 */
export function stripCommentLines(text) {
  return text
    .split(/\r?\n/)
    .filter((l) => !COMMENT_ONLY_LINE.test(l))
    .join("\n");
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|js|mjs)$/.test(entry.name)) out.push(full);
  }
  return out;
}

/* ------------------------------------------------------------------- selftest */

const F = (rel, body) => ({ label: rel, rel, text: body });

function runSelftest() {
  const cases = [
    {
      name: "GREEN 基线（整行注释点名禁令 + 读 yarn jar + 特赦文件只报错文案）",
      want: "ok",
      files: [
        F("mappings/notes.ts", '// 不要 readFileSync("data/fabric_1.21.1/mappings/yarn-mappings.json")\nexport const a = 1;\n'),
        F("decompile/java-pipeline.ts", 'const entries = readZip(readFileSync(yarnJarPath));\nexport default entries;\n'),
        F("mappings/yarn-sqlite.ts", 'throw new Error(`缺 yarn-mappings.json 预建库，请先跑 build-yarn-sqlite`);\n'),
      ],
    },
    {
      name: "POISON-A JSON.parse(readFileSync(…yarn-mappings.json)) 又回来了",
      wantFail: "yarn-mappings\\.json",
      files: [
        F("mappings/index.ts", 'const o = JSON.parse(readFileSync(join(dataDir, "yarn-mappings.json"), "utf8"));\nexport default o;\n'),
      ],
    },
    {
      name: "POISON-B 变量名暗示 yarn JSON（收窄后的 readFileSync(…yarn…json) 那条也得咬住）",
      wantFail: "readFileSync",
      files: [F("x/y.ts", 'const o = JSON.parse(readFileSync(yarnMappingsJson, "utf8"));\nexport default o;\n')],
    },
    {
      name: "POISON-C 挂在**行尾注释**里的路径不豁免（整行才豁免）",
      wantFail: "readFileSync",
      files: [F("x/z.ts", 'const o = readFileSync(yarnMappingsJson, "utf8"); // yarn-mappings.json 只是提一下\n')],
    },
    {
      name: "POISON-D 特赦文件真去加载时也照红（特赦 ≠ 白名单免检）",
      wantFail: "yarn-sqlite",
      files: [
        F("mappings/yarn-sqlite.ts", 'const o = JSON.parse(readFileSync(join(dir, "yarn-mappings.json"), "utf8"));\nexport default o;\n'),
      ],
    },
    {
      name: "CONTROL 不判对照：别的 json 文件 / 别的加载 API 不受本门管辖",
      want: "ok",
      files: [
        F("docs/store.ts", 'const o = JSON.parse(readFileSync(join(dir, "index-l0.json"), "utf8"));\nexport default o;\n'),
        F("docs/store2.ts", 'import { readFile } from "node:fs/promises";\nconst o = await readFile(join(dir, "fabric.mod.json"), "utf8");\n'),
      ],
    },
    {
      name: "FLOOR 采集器返回 0 ⇒ COLLECTOR_RETURNED_ZERO（换错根不是零缺陷）",
      wantFail: "COLLECTOR_RETURNED_ZERO",
      files: [],
      floor: true,
    },
  ];

  let bad = 0;
  for (const c of cases) {
    const { hits, errors } = evaluateSlurp(c.files);
    const problems = c.floor ? errors : hits.map((h) => `${h.label} :: ${h.re}`);
    if (c.want === "ok") {
      if (problems.length) {
        bad++;
        console.log(`  ✗ ${c.name} 应当绿，实际红 ${problems.length} 项：${problems[0]}`);
      } else console.log(`  ✓ ${c.name} → 绿`);
      continue;
    }
    const hit = problems.find((p) => p.includes(c.wantFail));
    if (!hit) {
      bad++;
      console.log(`  ✗ ${c.name} 应红在「${c.wantFail}」，实际失败 ${problems.length} 项（${problems[0] || "无"}）`);
    } else console.log(`  ✓ ${c.name} → 红：${hit.slice(0, 130)}`);
  }
  if (bad) {
    console.log(`assert-no-yarn-json-slurp --selftest: ${bad}/${cases.length} 例不符 ⇒ 判据已退化`);
    process.exit(1);
  }
  console.log(
    `assert-no-yarn-json-slurp --selftest: ok · ${cases.length} 例全中（${cases.filter((c) => c.wantFail).length} 投毒必红 + 基线绿 + 不判对照绿；内存夹具，未写盘）`,
  );
}

/* ----------------------------------------------------------------------- main */

if (process.argv.includes("--selftest")) {
  runSelftest();
  process.exit(0);
}

const testSrc = process.env.MC_SKILL_YARN_SLURP_GATE_SRC;
const srcRoot = testSrc ? path.resolve(testSrc) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

const collected = walk(srcRoot).map((f) => ({
  label: f,
  rel: path.relative(srcRoot, f).split(path.sep).join("/"),
  text: fs.readFileSync(f, "utf8"),
}));
const { scanned, hits, commentExempted, errors } = evaluateSlurp(collected);

if (errors.length) {
  console.error(`assert-no-yarn-json-slurp: ${srcRoot} 下一个 .ts/.js/.mjs 都没有 ⇒ 换错根，判不了（拒）`);
  process.exit(1);
}

if (hits.length) {
  console.error(
    `assert-no-yarn-json-slurp: 扫文件=${scanned} 注释豁免=${commentExempted.length} 拒=${hits.length} —— FORBIDDEN yarn-mappings.json slurp patterns found:`,
  );
  for (const h of hits) console.error(`  ${h.label} :: ${h.re}`);
  process.exit(1);
}

console.log(
  `assert-no-yarn-json-slurp: ok（扫文件=${scanned} 注释豁免=${commentExempted.length} 拒=0 · ${srcRoot}）`,
);
