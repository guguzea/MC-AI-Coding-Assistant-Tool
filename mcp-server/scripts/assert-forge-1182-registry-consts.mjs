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

/** 审计的六个常量：from 是本档出现的去下划线形，to 是审计主张的正名。 */
export const CONSTS = [
  { from: 'BLOCKENTITIES', to: 'BLOCK_ENTITIES', action: 'replace' },
  { from: 'SOUNDEVENTS', to: 'SOUND_EVENTS', action: 'replace' },
  { from: 'PARTICLETYPES', to: 'PARTICLE_TYPES', action: 'replace' },
  { from: 'ENTITYTYPES', to: 'ENTITY_TYPES', action: 'hold' },
  { from: 'FLUIDTYPES', to: 'FLUID_TYPES', action: 'hold' },
  { from: 'BLOCKCONTAINERS', to: 'BLOCK_CONTAINERS', action: 'hold' },
];

// ── B. 台账层（重算：MC_SKILL_F146_RELEDGER=1 只打印，不自动改写） ───────────
const LEDGER = {
  // 2026-09-13 实算并钉值（`MC_SKILL_F146_RELEDGER=1` 打印）：hold 三形的 source 面计数。
  // 注：这三形按 S20 的裁定**保持不改**（ENTITYTYPES 本档正名是 ForgeRegistries.ENTITIES；
  //     FLUIDTYPES 命中全在 ❌ 禁令内），故钉值用于防「顺手改」而不是待修数量。
  holds: { ENTITYTYPES: 15, FLUIDTYPES: 6, BLOCKCONTAINERS: 0 },
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
