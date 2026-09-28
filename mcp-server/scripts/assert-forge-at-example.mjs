/**
 * assert-forge-at-example —— Forge 各档 `mc-mixin` 源稿里的 AT 示例行，必须与**该档映射库现产的答案**逐字同答。
 *
 * 立案出处：`CONTRIBUTING.md` `L72`（第 53 轮把 `accessLines` 露进源稿时挖出的存量缺陷：
 * 8 档示例行用**可读成员名**写 AT，而本档语料逐字规定「the SRG name must be used for fields and
 * methods」（`data/forge_<v>/forge-docs/<v>/processed/advanced_accesstransformers.md:55`）⇒ 照抄即无效）。
 * 那条债当时只登记未回改，原因写在 L72：改了没有判据 = 下一轮又漂回来。本门就是那条判据。
 *
 * 判什么（四条腿，缺一腿都算门没跑）：
 *   FLOOR  地板：判到的源稿件数与 AT 行数必须 ≥ 下界（空扫描不许当绿）
 *   FORMAT 格式：字段行按本档语料只有 `<access> <class> <field>`，行尾多出的裸 token 判红
 *   SHAPE  形状：每条 AT 成员行的成员名必须是 SRG 形（`func_/field_/m_/f_`）或工具那两种 `<TODO…>` 标记
 *   ANSWER 同答：16 条 pin（8 档 × {方法 getHealth, 字段 deathTime}）逐字等于本门**现场问工具**得到的行
 *                —— owner 与描述符都由这同一次比对兜住（整行逐字，不改写不裁断）
 *
 * 关键设计：**期望值不手抄**。ANSWER 腿每次跑都现调 `convertMappingEx`（读 `data/forge_<v>/mappings/
 * yarn-mappings.sqlite`），所以库被重建、SRG 名换了、或某档压根给不出（1.14.4/1.15.2 三表 0 行 ⇒
 * `<TODO…>`），门都会当场把源稿判红，逼人来重新核对——这正是 L72 要的形状。
 *
 * 用法：
 *   node scripts/assert-forge-at-example.mjs              # 判红/绿（真跑，只读盘）
 *   node scripts/assert-forge-at-example.mjs --selftest   # 纯内存夹具：正对照 + 8 记投毒
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const DIST = path.join(REPO, "mcp-server", "dist");
const argv = process.argv.slice(2);
const SELFTEST = argv.includes("--selftest");

/** 源稿面 = forge 各档 mc-mixin 的 SKILL.md（1.12.2/1.13.2 无 AT 段，靠 FLOOR 的下界兜住）。 */
function repoSkillFiles(root) {
  const out = [];
  for (const v of fs.readdirSync(path.join(root, "forge"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()) {
    const p = path.join(root, "forge", v, ".cursor", "skills", "mc-mixin", "SKILL.md");
    if (fs.existsSync(p)) out.push({ version: v, file: p, text: fs.readFileSync(p, "utf8") });
  }
  return out;
}

/** 把一行 AT 拆成 {access, cls, member, descriptor, extra}；不是 AT 成员行就返回 null。 */
export function parseAtLine(rawLine) {
  const line = rawLine.trim();
  const m = /^(public|protected|private)\s+(\S+)\s+(.*)$/.exec(line);
  if (!m) return null;
  const [, access, cls, tailRaw] = m;
  if (!/^net\.minecraft\./.test(cls)) return null;
  const tokens = tailRaw.split("#")[0].trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return null; // 只有类名的行（`public net.minecraft.Util`）不在本门面
  const head = tokens[0];
  const extra = tokens.slice(1).join(" ") || null; // 字段行按语料格式不该有第二个 token
  // `<TODO…>` 串里带圆括号，必须先于「按 ( 拆描述符」处理，否则成员名会被劈成半截
  if (head.startsWith("<")) return { access, cls, member: head, descriptor: null, extra };
  const paren = head.indexOf("(");
  if (paren === -1) return { access, cls, member: head, descriptor: null, extra };
  const close = head.lastIndexOf(")");
  if (close < paren) return null;
  return {
    access,
    cls,
    member: head.slice(0, paren),
    descriptor: head.slice(paren, close + 1) + head.slice(close + 1),
    extra,
  };
}

/** 从源稿正文里收集全部 AT 成员行（含围栏内外，逐行判）。 */
export function collectAtLines(text) {
  const rows = [];
  for (const [i, l] of text.split(/\r?\n/).entries()) {
    const parsed = parseAtLine(l);
    if (parsed) rows.push({ ...parsed, lineNo: i + 1, raw: l.trim() });
  }
  return rows;
}

/**
 * pin 表：owner 一律斜杠形（工具入参），readable 用 mojmap 可读名。
 * getHealth/deathTime 是本轮现验过「六档全命中」的两名（1.14.4/1.15.2 命中不了 ⇒ 期望 <TODO…>，
 * 那条期望本身就是反证：谁把它们写成实名就是假答案）。
 */
const LIVING = {
  "1.14.4": "net/minecraft/entity/LivingEntity",
  "1.15.2": "net/minecraft/entity/LivingEntity",
  "1.16.5": "net/minecraft/entity/LivingEntity",
  "1.17.1": "net/minecraft/world/entity/LivingEntity",
  "1.18.2": "net/minecraft/world/entity/LivingEntity",
  "1.19.4": "net/minecraft/world/entity/LivingEntity",
  "1.20.1": "net/minecraft/world/entity/LivingEntity",
  "1.20.4": "net/minecraft/world/entity/LivingEntity",
};
const PINS = [];
for (const [version, ownerClass] of Object.entries(LIVING)) {
  PINS.push({ version, kind: "method", readable: "getHealth", ownerClass });
  PINS.push({ version, kind: "field", readable: "deathTime", ownerClass });
}

const FLOOR_FILES = 8;
const FLOOR_LINES = 12;

let distCache = null;
async function loadDist() {
  if (distCache) return distCache;
  for (const rel of ["mappings/access-lines.js", "mappings/convert-extras.js"]) {
    if (!fs.existsSync(path.join(DIST, rel))) {
      throw new Error(`dist 不存在（先 cd mcp-server && npm run build）：缺 dist/${rel}`);
    }
  }
  const a = await import(pathToFileURL(path.join(DIST, "mappings/access-lines.js")).href);
  const c = await import(pathToFileURL(path.join(DIST, "mappings/convert-extras.js")).href);
  distCache = { isSrgName: a.isSrgName, convertMappingEx: c.convertMappingEx };
  return distCache;
}

/** 现问工具取该 pin 的规范行；返回 {line, complete}。 */
async function canonical(pin) {
  const { convertMappingEx } = await loadDist();
  const r = convertMappingEx({
    from: "mojang", to: "mcp", memberName: pin.readable, ownerClass: pin.ownerClass,
    version: pin.version, memberKind: pin.kind, accessLines: true, platform: "forge",
  });
  const e = (r.accessLines?.entries ?? []).find((x) => x.format === "at") ?? r.accessLines?.entries?.[0] ?? null;
  return { line: e?.line ?? null, complete: e?.complete ?? false, selfCheckOk: e?.selfCheckOk ?? null };
}

/**
 * 主判据。files = [{version, file, text}]（真跑由磁盘读，selftest 由内存夹具给 ⇒ 投毒不碰仓库）。
 * 返回 {problems, stats}。
 */
export async function checkForgeAtExamples(files) {
  const { isSrgName } = await loadDist();
  const problems = [];
  const byVersion = new Map();
  for (const f of files) {
    const rows = collectAtLines(f.text);
    if (rows.length) byVersion.set(f.version, rows);
  }
  const totalRows = [...byVersion.values()].reduce((a, b) => a + b.length, 0);

  // FLOOR：扫不到东西不许当绿（本仓点名的「空产物过遍内容门」形状）
  if (byVersion.size < FLOOR_FILES) {
    problems.push(`[FLOOR] 含 AT 成员行的源稿档数: 实得 ${byVersion.size}，下界 ${FLOOR_FILES} ⇒ 判据面塌了（文件名/格式漂移或库改动把示例段挤没了）`);
  }
  if (totalRows < FLOOR_LINES) {
    problems.push(`[FLOOR] AT 成员行总数: 实得 ${totalRows}，下界 ${FLOOR_LINES}`);
  }

  // FORMAT：字段行只许 `<access> <class> <field>`——本档语料的 Fields 节逐字如此（1.16.5 与 1.17.1
  // 两侧本轮实读同款），旧示例里多出来的裸描述符 token（`health F`）不在语法内
  for (const f of files) {
    for (const row of collectAtLines(f.text)) {
      if (row.extra) {
        problems.push(
          `[FORMAT] ${path.relative(REPO, f.file).replace(/\\/g, "/")}:${row.lineNo} 行尾多出 token「${row.extra}」`
            + `⇒ 本档语料的字段格式是 \`<access modifier> <fully qualified class name> <field name>\`（Fields 节，无描述符）`,
        );
      }
    }
  }

  // SHAPE：每条 AT 成员行的成员名必须 SRG 形，或**工具自己会吐的那两种 TODO 标记**（拼错的标记如
  // `<TODO:SRD名>` 不算 —— 人读起来一样像「未核实」，机器却再也对不上任何一行）
  for (const f of files) {
    for (const row of collectAtLines(f.text)) {
      const isTodo = /^(?:<TODO:SRG名>|<TODO:描述符>)+$/.test(row.member);
      if (!isTodo && !isSrgName(row.member)) {
        problems.push(`[SHAPE] ${path.relative(REPO, f.file).replace(/\\/g, "/")}:${row.lineNo} 成员名「${row.member}」既不是 SRG 形也不是 <TODO…> ⇒ 照抄进工程即无效（AT 要 SRG 名）`);
      }
    }
  }

  // ANSWER + OWNER：16 条 pin 逐字同答
  let pinHit = 0;
  const pinRows = [];
  for (const pin of PINS) {
    const want = await canonical(pin);
    if (!want.line) {
      problems.push(`[ANSWER] pin ${pin.version}/${pin.kind}/${pin.readable} 工具没给行 ⇒ 无从判同答（库不在？dist 过期？）`);
      continue;
    }
    pinRows.push({ pin, want });
    const f = files.find((x) => x.version === pin.version);
    if (!f) {
      problems.push(`[ANSWER] 档 ${pin.version} 没有 mc-mixin 源稿 ⇒ pin 无处可判`);
      continue;
    }
    const rows = collectAtLines(f.text);
    const same = rows.find((r) => r.raw === want.line.trim());
    if (same) {
      pinHit += 1;
      continue;
    }
    // 同答失败要区分「写错了」和「压根没有这条」
    const near = rows.find((r) => r.member === want.line.match(/\s(\S+)\s*[($]/)?.[1]);
    problems.push(
      `[ANSWER] ${pin.version} ${pin.kind} ${pin.readable}：源稿无此行，工具现产 = 「${want.line}」（complete=${want.complete}）`
        + (near ? `；源稿最接近的一行是 :${near.lineNo} 「${near.raw}」` : `；源稿该档 AT 行 ${rows.length} 条里没有任何一行的成员名对得上`),
    );
  }
  if (pinHit < PINS.length) {
    problems.push(`[ANSWER] 同答 pin 数: 实得 ${pinHit}，期望 ${PINS.length}（8 档 × {方法, 字段}）`);
  }
  return {
    problems,
    stats: {
      档数: byVersion.size,
      AT行: totalRows,
      pin: `${pinHit}/${PINS.length}`,
      todoPins: pinRows.filter((p) => /<TODO/.test(p.want.line)).length,
    },
  };
}

// ── selftest：正对照 + 8 记投毒，全在内存，不写仓库 ──────────────────────────
const GREEN = (() => {
  // 每个档两行，逐字按本门 canonical 之外的「已知正确形状」写死；投毒就改其中一行
  const body = {
    "1.14.4": [
      "public net.minecraft.entity.LivingEntity <TODO:SRG名><TODO:描述符> #getHealth",
      "public net.minecraft.entity.LivingEntity <TODO:SRG名> #deathTime",
    ],
    "1.15.2": [
      "public net.minecraft.entity.LivingEntity <TODO:SRG名><TODO:描述符> #getHealth",
      "public net.minecraft.entity.LivingEntity <TODO:SRG名> #deathTime",
    ],
    "1.16.5": [
      "public net.minecraft.entity.LivingEntity func_110143_aJ()F #getHealth",
      "public net.minecraft.entity.LivingEntity field_70725_aQ #deathTime",
    ],
    "1.17.1": [
      "public net.minecraft.world.entity.LivingEntity m_21223_()F #getHealth",
      "public net.minecraft.world.entity.LivingEntity f_20919_ #deathTime",
    ],
    "1.18.2": [
      "public net.minecraft.world.entity.LivingEntity m_21223_()F #getHealth",
      "public net.minecraft.world.entity.LivingEntity f_20919_ #deathTime",
    ],
    "1.19.4": [
      "public net.minecraft.world.entity.LivingEntity m_21223_()F #getHealth",
      "public net.minecraft.world.entity.LivingEntity f_20919_ #deathTime",
    ],
    "1.20.1": [
      "public net.minecraft.world.entity.LivingEntity m_21223_()F #getHealth",
      "public net.minecraft.world.entity.LivingEntity f_20919_ #deathTime",
    ],
    "1.20.4": [
      "public net.minecraft.world.entity.LivingEntity m_21223_()F #getHealth",
      "public net.minecraft.world.entity.LivingEntity f_20919_ #deathTime",
    ],
  };
  return Object.entries(body).map(([version, lines]) => ({
    version,
    file: path.join(REPO, "forge", version, ".cursor", "skills", "mc-mixin", "SKILL.md"),
    text: ["## AT", "```", ...lines, "```", ""].join("\n"),
  }));
})();

function mutate(version, fn) {
  return GREEN.map((f) => (f.version === version ? { ...f, text: fn(f.text) } : f));
}

const POISONS = [
  { name: "正对照：不改 ⇒ 必须 0 问题", files: () => GREEN, leg: null, wantGreen: true },
  { name: "把 1.20.1 的方法行改回可读名 getHealth()F", files: () => mutate("1.20.1", (t) => t.replace("m_21223_()F", "getHealth()F")), leg: "SHAPE" },
  { name: "1.20.1 字段行的成员换成同库另一字段 f_20916_(hurtTime)", files: () => mutate("1.20.1", (t) => t.replace("f_20919_", "f_20916_")), leg: "ANSWER" },
  { name: "1.20.1 方法行 owner 换成 Entity（同档邻类顶替）", files: () => mutate("1.20.1", (t) => t.replace("world.entity.LivingEntity m_21223_", "world.entity.Entity m_21223_")), leg: "ANSWER" },
  { name: "1.20.1 字段行尾加一个裸描述符 F（旧示例的形状）", files: () => mutate("1.20.1", (t) => t.replace("f_20919_ #deathTime", "f_20919_ F #deathTime")), leg: "FORMAT" },
  { name: "1.20.1 方法行描述符 ()F 改成 ()V", files: () => mutate("1.20.1", (t) => t.replace("m_21223_()F", "m_21223_()V")), leg: "ANSWER" },
  { name: "1.14.4 的 <TODO> 换成一个「像真的」SRG 名（库给不出却手写实名）", files: () => mutate("1.14.4", (t) => t.replace("<TODO:SRG名><TODO:描述符>", "func_110143_aJ()F")), leg: "ANSWER" },
  { name: "1.15.2 字段行的 TODO 标记拼错成 <TODO:SRD名>", files: () => mutate("1.15.2", (t) => t.replace("<TODO:SRG名> #deathTime", "<TODO:SRD名> #deathTime")), leg: "SHAPE" },
  { name: "删掉 1.19.4 整个 AT 段（档数与行数双塌）", files: () => GREEN.filter((f) => f.version !== "1.19.4"), leg: "FLOOR" },
  { name: "只剩 1 档（判据面空转的形状）", files: () => GREEN.slice(0, 1), leg: "FLOOR" },
];

async function runSelftest() {
  let fails = 0;
  for (const p of POISONS) {
    const { problems } = await checkForgeAtExamples(p.files());
    const legs = new Set(problems.map((x) => /^\[([A-Z]+)\]/.exec(x)?.[1]).filter(Boolean));
    if (p.wantGreen) {
      const ok = problems.length === 0;
      console.log(`${ok ? "✓" : "✗"} 对照「${p.name}」⇒ 问题 ${problems.length} 条（要 0）`);
      if (!ok) { fails += 1; for (const x of problems.slice(0, 4)) console.log(`    ${x}`); }
      continue;
    }
    const hit = legs.has(p.leg);
    console.log(`${hit ? "✓" : "✗"} 投毒「${p.name}」→ ${p.leg}${hit ? "" : ` 未红（实得 legs=${[...legs].join(",") || "无"}）`}`);
    if (!hit) fails += 1;
  }
  const { stats } = await checkForgeAtExamples(GREEN);
  console.log(`\nassert-forge-at-example(selftest): ${fails ? `FAIL（${fails} 记不符）` : `OK（${POISONS.length - 1} 记投毒 + 1 正对照 · 夹具 ${stats.档数} 档/${stats.AT行} 行 · pin ${stats.pin}）`}`);
  process.exit(fails ? 1 : 0);
}

async function main() {
  const files = repoSkillFiles(REPO);
  const { problems, stats } = await checkForgeAtExamples(files);
  if (problems.length) {
    console.log(`assert-forge-at-example: RED（${problems.length} 条）`);
    for (const p of problems) console.log(`  - ${p}`);
    process.exit(1);
  }
  console.log(
    `assert-forge-at-example: OK（源稿 ${files.length} 档，其中含 AT 成员行 ${stats.档数} 档 / ${stats.AT行} 条 · `
      + `pin 同答 ${stats.pin}（工具按设计给不出、行内留 <TODO…> 的 ${stats.todoPins} 条）· `
      + "期望值每次现问 convert_mapping，不手抄）",
  );
}

if (SELFTEST) await runSelftest();
else await main();
