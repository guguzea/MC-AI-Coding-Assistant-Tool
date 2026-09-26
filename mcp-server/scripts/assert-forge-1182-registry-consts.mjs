#!/usr/bin/env node
/**
 * assert-forge-1182-registry-consts — forge/1.18.2 注册表常量下划线审计（F146 门族并入版）。
 *
 * 来源：`temp/f146-gate.mjs`（S20 一次性脚本，V1–V7 判据 + 桶↔清单自洽断言）。
 * 本版为**只读门**：不写任何文件；台账改为常量内钉值，重算用 `MC_SKILL_F146_RELEDGER=1` 打印。
 *
 * 判据：
 *   F1 replace 形在当前写盘面（source scope）必须绝迹
 *   F2 不得出现双下划线残件（`BLOCK__ENTITIES` 等）
 *   F3 hold 形的三类计数必须等于台账钉值（防「顺手改」）
 *   F4 replace 映射幂等（第二遍为 no-op）
 *   F5 桶之和 == 逐文件清单之和（计数器自洽；原脚本的 rc=3 语义）
 *   F6 六个技能源稿与其 7 份宿主投影逐字节一致（漂移必须为 0）
 * 投毒：`--selftest`（纯内存，不落盘）证明 F1/F2/F3 能红。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..', '..', 'forge', '1.18.2');

/** 本门允许改动的目录（其余面只读）。 */
const SOURCE_DIRS = ['.cursor/skills', 'knowledge', 'code-patterns'];
const PROJECTIONS = ['.agents', '.claude', '.continue', '.opencode', '.pi', '.trae', '.zcode'];

/** 审计的六个常量：from 是本档出现的去下划线形，to 是审计主张的正名。
 *  ⚠️ 例外：`FLUIDTYPES` 带 `verdict:'absent'` —— 1.18.2 根本没有那个注册表，它的 `to` 只是「`FLUID_TYPES`
 *  自 1.19+ 才有」的口径标注、**不是** 1.18.2 答案（`to` 本身不参与任何断言：F1/F4 只过滤 replace 腿）。 */
export const CONSTS = [
  { from: 'BLOCKENTITIES', to: 'BLOCK_ENTITIES', action: 'replace' },
  { from: 'SOUNDEVENTS', to: 'SOUND_EVENTS', action: 'replace' },
  { from: 'PARTICLETYPES', to: 'PARTICLE_TYPES', action: 'replace' },
  { from: 'ENTITYTYPES', to: 'ENTITIES', action: 'hold' },
  // verdict:'absent'（2026-09-24 Ralph 第 24 轮，一手坐实）：**1.18.2 的 ForgeRegistries 没有「流体类型」
  // 注册表** —— `FLUIDTYPES` 与 `FLUID_TYPES` 两个写法在该版本都不存在，流体注册表叫 `FLUIDS`。
  // ⇒ 本项的 `to` **不是** 1.18.2 正名，只是「`FLUID_TYPES` 属 1.19+」的口径标注（`to` 不参与任何断言：
  // F1/F4 只过滤 action==='replace'，F3 只数 `from`），但不得再留一个会被读成答案的裸名字。
  // 判据仍是 hold（本门不自动替换它；生产侧的改法 = 删/改写那些表行，**不是**改名成 FLUID_TYPES）。
  { from: 'FLUIDTYPES', to: '(1.18.2 无此注册表；FLUID_TYPES 自 1.19+ 才有)', action: 'hold', verdict: 'absent' },
  { from: 'BLOCKCONTAINERS', to: 'BLOCK_CONTAINERS', action: 'hold' },
];

// ── B. 台账层（重算：MC_SKILL_F146_RELEDGER=1 只打印，不自动改写） ───────────
const LEDGER = {
  // 2026-09-13 首次实算钉值 15/6/0。ENTITYTYPES 的 `to` 只作口径说明，hold 形不参与 F1/F4 替换。
  // **2026-09-23（S25）撤回 2026-09-13 的「保持不改」裁定**（用户批准）：本档处方行统一改落
  //   `ForgeRegistries.ENTITIES`；1.19 起该字段才改名 `ENTITY_TYPES`；`ENTITYTYPES` 在任何 Forge
  //   版本都不存在 ⇒ source 面 15 → 5。**本门判据与 holds 钉值不随出处口径改动**（5a 轮只改注释）。
  //   **2026-09-24（Ralph 第 19 轮，S25 尾）核验并同批重签**：处方腿已落盘兑现（非只改注释）——1.18.2
  //   源面 `ENTITYTYPES` 处方 **0** 处（正名 `ForgeRegistries.ENTITIES`：canonical 面 **9 份文件 / 11 处**，
  //   口径 = `grep -o` 逐次计数、排除 7 个宿主镜像目录只留 `.cursor` 与 knowledge/ 等源面，as-of 2026-09-24；
  //   原写「10 处」为未经核对的数，第 19 轮验收时按现算改并补口径归属），1.19.4 全树 `ENTITYTYPES` **0** 命中（正名 `ENTITY_TYPES`；两档禁止平推）。
  //   `MC_SKILL_F146_RELEDGER=1` 实算仍 5/6/0 ⇒ **钉值照抄未变**；`sync-skills`（1.18.2 + 1.19.4 两个
  //   target）后 F6 实测 drift 仍 0 ⇒ `mirrorDrift` 亦未重钉。口径归属：改口由 2026-09-23 S25 裁定
  //   （用户批准）作出，本轮只做逐名复核与记账，未新增任何口径。证据 = `temp/ralph-20260922/logs/r19-*.log`。
  // ── 出处档位口径（2026-09-23 第 5a 轮定三档；2026-09-24 第 24 轮按一手证据升到四档）────────────
  //   ① **语料逐字**（本仓 `data/**` 上游正文可复核）：仍然只有 `BLOCKS` / `ITEMS` ——
  //      `data/forge_1.18.2/forge-docs/1.18.2/processed/concepts_registries.md:24,96`
  //      （`ForgeRegistries.BLOCKS` / `ITEMS` 逐字）与
  //      `data/forge_1.19.4/forge-docs/1.19.4/processed/concepts_registries.md:24,106`。**这条没变。**
  //   ①b **官方构件逐字（自备 jar 可复核，仓内无副本）**（2026-09-24 新增档）：`ENTITIES` / `BLOCK_ENTITIES` /
  //      `SOUND_EVENTS` / `PARTICLE_TYPES` / `CONTAINERS` / `PAINTING_TYPES` / **`FLUIDS`**@1.18.2 ——
  //      由两个独立 build、两种独立机制互证：官方 1.18.2-40.1.80 **源码** `ForgeRegistries.java`（157 行，
  //      `grep FLUID` 只命中 `:58` 的 `FLUIDS` 字段与 `:104` 的 `Keys.FLUIDS`）＋ 官方 1.18.2-40.3.12
  //      **universal jar** 的编译类（`javap -p` 输出 41 行、注册表字段共 **32** 个）。档位仍属「外部」：
  //      jar 在盘、sha 可复核，但构件**不入库** ⇒ 复核者需自备 jar。⚠️ `temp/**` 不入库，故复核命令**原样抄在
  //      本注释里**（把 `<…>` 换成本地路径，两条各一行）：
  //        `unzip -p <forge-1.18.2-40.1.80-sources.jar> net/minecraftforge/registries/ForgeRegistries.java`
  //        `javap -p -classpath <forge-1.18.2-40.3.12-universal.jar> net.minecraftforge.registries.ForgeRegistries`
  //   ② **处方-only**（本档 rules/skills 自撰、无外部出处）：**本档现为空** —— 旧列的 `SOUND_EVENTS` /
  //      `PARTICLE_TYPES` / `FLUIDS` 已由 ①b 坐实；旧列的 `FLUID_TYPES`@1.18.2 改判 **证伪**（见 ④）。
  //      摘要面亦无能力：`mcp-server/data/loader-api-summaries/1.18.2-forge.json` 的 `fields` 恒 0，且
  //      `ForgeRegistries` 类本身不在 `classes` / `fqcnIndex` ⇒ `query_loader_api` / `ingest_loader_api`
  //      **答不了字段名**，不要用 ingest 去「复现」本结论。
  //   ③ **外部-only（仓内不可复核）**：`ENTITY_TYPES`@1.19.4 —— 本次**未取证**，仍停在旧档（1.19.4 侧字段名
  //      与 1.18.2 不同源，禁止拿 ①b 的结论外推过去）。`MENU_TYPES`（1.20.x 侧）同理未取证、未动。
  //   ④ **证伪（不是未核实）**：`FLUIDTYPES`@1.18.2 与 `FLUID_TYPES`@1.18.2 —— 两 build 全分母 0 命中
  //      ⇒ 1.18.2 **没有流体类型注册表**；`FluidType` + `FLUID_TYPES` 自 1.19 才引入。生产侧四张表
  //      （antipatterns/registry.md、common/glossary.md、version-changes/1.18.x.md、scaffold/README_AI.md）
  //      与 porting/01-api-cross-loader.md 的旧「正名 + 未核实」写法已删改，冲突判给
  //      `.cursor/skills/mc-fluid/SKILL.md:22`、`:102` 的 ❌ 禁令侧。
  //   ⚠️ **禁止把本档规则行当外部出处（那是循环引证）**：本注释旧版曾写「出处
  //      `forge/1.18.2/.cursor/rules/01-registry.mdc:27`」「`forge/1.19.4/.cursor/rules/01-registry.mdc:27`」——
  //      那两行**正是 S25 自己改过的处方面**，只能当「改完后的实况」读，不构成名字存在性的证据。
  //      四档都给不出的名字一律留 `// TODO(未核实)`，禁止凭训练记忆补。
  // 现钉 5 的构成（无一是漏网处方）：mc-entity/SKILL.md 示例里 DeferredRegister 的**局部变量名**
  //   ENTITYTYPES（:16 声明、:19/:29 使用）+ 该 Skill 的 ❌ 禁令行 :135（禁令行按 R31 不碰，它引用的
  //   就是上面那个变量，只改它会指向未声明变量）+ version-changes/1.18.x.md:28 的更正说明「该名不存在」。
  // ── FLUIDTYPES 于 2026-09-24（Ralph 第 24 轮）重签 **6 → 10**，BLOCKCONTAINERS 仍 0（未取证，按 R53 不动）──
  //   旧 6 = 2 条 ❌ 禁令 + 4 条**处方表行**（antipatterns/registry.md:130、common/glossary.md:44、
  //   porting/01-api-cross-loader.md:31、version-changes/1.18.x.md:30）；那 4 条现已全部删改（见 ④ 档），
  //   计数反而涨到 10 —— 因为「解释为什么这个名字不存在」必须把名字写出来。F3 是**等式棘轮**
  //   （`now === pinned`，不是上界）⇒ 涨/跌都得逐处点名，防的就是「顺手多写一处」。口径 = source 桶
  //   （`.cursor/skills` + `knowledge` + `code-patterns`，`grep -o` 逐次计数、7 个宿主镜像目录不计，
  //   as-of 2026-09-24）。10 处逐点：
  //     1-2) `.cursor/skills/mc-fluid/SKILL.md:22`、`:102` = ❌ 禁令（本轮一个字没动，它是胜侧）
  //     3)   `knowledge/antipatterns/registry.md:130` = 表行「`FLUIDTYPES` 与 `FLUID_TYPES` 都不存在」说明
  //     4-5) 同文件 `:135` ×2 = 引述旧处方「把 FLUIDTYPES 当 1.18.2 正名」＋「既没有 FLUIDTYPES 也没有 FLUID_TYPES」证伪
  //     6)   同文件 `:136` = 证据行的过滤模式串（按 `FLUIDTYPES|FLUID_TYPES` 在 32 字段全分母上 0 命中）
  //     7)   `knowledge/common/glossary.md:51` = 表注证伪（该行本身已改成 `FLUIDS`）
  //     8)   `knowledge/porting/01-api-cross-loader.md:31` = 移植警告「不要给 1.18.2 写流体类型注册表」
  //     9)   `knowledge/version-changes/1.18.x.md:30` = 表行「1.18.x 没有流体类型注册表」说明
  //     10)  同文件 `:32` = 表注证伪
  //   ⇒ **零处**把 `FLUIDTYPES` 当 1.18.2 的正名处方（A6 grep 复核同结论）。另有 4 处在
  //   `scaffold/README_AI.md`（:211 表行 + :219/:220 注），属**独立的 `scaffold` 桶**、不计入 holds。
  holds: { ENTITYTYPES: 5, FLUIDTYPES: 10, BLOCKCONTAINERS: 0 },
  mirrorDrift: 0,
};

const RELEDGER = process.env.MC_SKILL_F146_RELEDGER === '1';
const DOUBLE_UNDERSCORE = ['BLOCK__ENTITIES', 'ENTITY__TYPES', 'BLOCK__CONTAINERS', 'FLUID__TYPES', 'SOUND__EVENTS', 'PARTICLE__TYPES'];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      walk(p, out);
    } else if (e.isFile()) out.push(p);
  }
  return out;
}
export const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
export function scope(r) {
  const top = r.split('/')[0];
  if (PROJECTIONS.includes(top)) return 'projection';
  if (top === '.cursor') return r.startsWith('.cursor/skills/') ? 'source' : 'rules';
  if (SOURCE_DIRS.includes(top)) return 'source';
  if (top === 'scaffold') return 'scaffold';
  return 'other';
}
export function readFiles() {
  if (!fs.existsSync(ROOT)) throw new Error('ROOT missing: ' + ROOT);
  return walk(ROOT).map((p) => ({ p, r: rel(p), text: fs.readFileSync(p, 'utf8') }));
}
const count = (text, needle) => {
  let n = 0, i = text.indexOf(needle);
  while (i !== -1) { n += 1; i = text.indexOf(needle, i + needle.length); }
  return n;
};

/** 桶计数（含自洽断言所需的逐文件清单）。 */
export function inventory(files) {
  const inv = {};
  for (const c of CONSTS) inv[c.from] = { action: c.action, to: c.to, source: 0, projection: 0, rules: 0, scaffold: 0, other: 0, files: {} };
  for (const f of files) {
    for (const c of CONSTS) {
      const n = count(f.text, c.from);
      if (!n) continue;
      const b = inv[c.from];
      b[scope(f.r)] += n;
      b.files[f.r] = (b.files[f.r] || 0) + n;
    }
  }
  return inv;
}

export function verifyChecks(files) {
  const src = files.filter((f) => scope(f.r) === 'source');
  const inv = inventory(files);
  const checks = [];

  for (const c of CONSTS.filter((x) => x.action === 'replace')) {
    const bad = src.filter((f) => f.text.includes(c.from)).map((f) => f.r);
    checks.push({ id: 'F1:' + c.from, ok: bad.length === 0, detail: bad.length ? 'residual in ' + bad.join(', ') : 'clean' });
  }
  for (const f of src) {
    for (const d of DOUBLE_UNDERSCORE) if (f.text.includes(d)) checks.push({ id: 'F2:' + f.r, ok: false, detail: 'double underscore ' + d });
    const suspicious = (f.text.match(/[A-Z]+__[A-Z]+/g) || []).filter((t) => /ENTITY|SOUND|PARTICLE|FLUID|CONTAINER/.test(t));
    if (suspicious.length) checks.push({ id: 'F2:' + f.r, ok: false, detail: 'suspicious ' + suspicious.join(',') });
  }
  checks.push({ id: 'F2:scan', ok: true, detail: 'double-underscore scan done' });

  for (const c of CONSTS.filter((x) => x.action === 'hold')) {
    const now = inv[c.from].source;
    const pinned = LEDGER.holds[c.from];
    checks.push({ id: 'F3:' + c.from, ok: now === pinned, detail: 'pinned ' + pinned + ' / now ' + now });
  }
  const idem = src.every((f) => {
    let t = f.text;
    for (const c of CONSTS.filter((x) => x.action === 'replace')) t = t.split(c.from).join(c.to);
    return t === f.text;
  });
  checks.push({ id: 'F4:idempotent', ok: idem, detail: idem ? 'second pass is a no-op' : 'NOT idempotent' });

  let mismatch = 0;
  for (const c of CONSTS) {
    const e = inv[c.from];
    const bucketSum = e.source + e.projection + e.rules + e.scaffold + e.other;
    const listSum = Object.values(e.files).reduce((s, n) => s + n, 0);
    if (bucketSum !== listSum) mismatch += 1;
  }
  checks.push({ id: 'F5:selfconsistency', ok: mismatch === 0, detail: mismatch === 0 ? 'all buckets reconcile with per-file listing' : mismatch + ' bucket/list mismatch(es)' });

  const mirrorNames = ['mc-registry', 'mc-entity', 'mc-blockentity', 'mc-fluid', 'mc-particle', 'mc-sound'];
  let drift = 0;
  const drifted = [];
  for (const n of mirrorNames) {
    const s = files.find((f) => f.r === '.cursor/skills/' + n + '/SKILL.md');
    if (!s) continue;
    for (const pr of PROJECTIONS) {
      for (const cand of [pr + '/skills/' + n + '/SKILL.md', pr + '/skills/' + n + '.md']) {
        const p = files.find((f) => f.r === cand);
        if (p && p.text !== s.text) { drift += 1; drifted.push(cand); }
      }
    }
  }
  checks.push({ id: 'F6:mirror-drift', ok: drift === LEDGER.mirrorDrift, detail: 'drift ' + drift + ' (pinned ' + LEDGER.mirrorDrift + ')' + (drifted.length ? ' → ' + drifted.slice(0, 5).join(', ') : '') });
  return checks;
}

function selftest(files) {
  const mk = (r, text) => ({ p: path.join(ROOT, r), r, text });
  const cases = [
    ['F1 replace 形残留', 'knowledge/common/glossary.md', '\nForgeRegistries.BLOCKENTITIES\n', 'F1:BLOCKENTITIES'],
    ['F2 双下划线', 'code-patterns/03-entity-patterns.md', '\nBLOCK__ENTITIES\n', 'F2:'],
    ['F3 hold 形漂移', '.cursor/skills/mc-fluid/SKILL.md', '\nFLUIDTYPES\n', 'F3:FLUIDTYPES'],
  ];
  let missed = 0;
  for (const [label, r, add, prefix] of cases) {
    const poisoned = files.map((f) => (f.r === r ? mk(r, f.text + add) : f));
    const hit = verifyChecks(poisoned).some((c) => c.id.startsWith(prefix) && !c.ok);
    console.log(`  selftest ${hit ? 'DETECTED' : 'MISSED (gate is fake)'}  ${label}`);
    if (!hit) missed += 1;
  }
  const cleanFail = verifyChecks(files).filter((c) => !c.ok);
  console.log(`  selftest control: 当前树失败 ${cleanFail.length} 项` + (cleanFail.length ? ' → ' + cleanFail.map((c) => c.id).join(', ') : ''));
  return missed;
}

const main = () => {
  let files;
  try { files = readFiles(); } catch (e) { console.error('assert-forge-1182-registry-consts: ' + e.message); process.exit(1); }
  if (process.argv.includes('--selftest')) {
    const missed = selftest(files);
    console.log(`\nassert-forge-1182-registry-consts(selftest): ${missed === 0 ? 'OK（三记投毒均被检出）' : missed + ' 记投毒漏检'}`);
    process.exitCode = missed === 0 ? 0 : 1;
    return;
  }
  if (RELEDGER) {
    const inv = inventory(files);
    const holds = {};
    for (const c of CONSTS.filter((x) => x.action === 'hold')) holds[c.from] = inv[c.from].source;
    console.log('[reledger] 台账重算（把下面的数抄回 LEDGER 常量再提交）：');
    console.log(JSON.stringify({ holds, mirrorDrift: LEDGER.mirrorDrift }, null, 2));
    console.log('  （mirrorDrift 需先跑 sync-skills，再按 F6 实测值钉）');
    return;
  }
  const checks = verifyChecks(files);
  const bad = checks.filter((c) => !c.ok);
  const inv = inventory(files);
  const srcTotal = Object.values(inv).reduce((s, e) => s + e.source, 0);
  for (const c of bad) console.log(`  ✗ ${c.id}: ${c.detail}`);
  console.log(
    `assert-forge-1182-registry-consts(F146): source 面命中 ${srcTotal} · ` +
      `replace 形残留 ${bad.filter((c) => c.id.startsWith('F1')).length} · ` +
      `hold 计数 ${CONSTS.filter((x) => x.action === 'hold').map((c) => c.from + '=' + inv[c.from].source).join('/')} · ` +
      `镜像漂移 ${bad.filter((c) => c.id.startsWith('F6')).length ? '非 0' : '0'} · ${bad.length === 0 ? 'GREEN' : bad.length + ' 项不通过'}`,
  );
  process.exitCode = bad.length === 0 ? 0 : 1;
};
main();
