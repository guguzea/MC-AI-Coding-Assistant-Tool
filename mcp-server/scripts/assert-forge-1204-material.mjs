/**
 * Gate：F145 —— forge/1.20.4 档源稿不得再引用 1.20+ 已移除的方块 `Material`。
 *
 * 背景：`BlockBehaviour.Properties.of(Material.X)` 这一族在本档规则 / Skill / knowledge 里
 * 成片出现过（27 个 `Material.` 记号 / 21 行），是从 `forge/1.19.4` 整篇复制时带进来的回归
 * （1.19.4 里 `Properties.of(Material)` 是对的，1.20+ 参数被删）。手工改一轮挡不住下一次
 * 「从邻档拷正文」，所以钉成档级静态门。
 *
 * 三条一手证据（复核命令，均在仓库根跑）：
 *   1. node -e "…"：data/forge_1.20.4/extracted/api-index.json 里
 *      `net/minecraft/world/level/block/state/BlockBehaviour$Properties` 的工厂只有
 *      `of => ()L…$Properties;`（**无参**），且有
 *      `mapColor => (Lnet/minecraft/world/level/material/MapColor;)L…$Properties;` 三重载；
 *      整份索引里 `MaterialColor` 0 次、`Material.STONE` 0 次、包名 `block.material` 0 次。
 *   2. grep -c "block[.]material" data/forge_1.20.4/mappings/client.txt → 0（官方 1.20.4 mojmap
 *      里 `net.minecraft.world.level.block.material.Material` 类不存在）；同文件
 *      `net.minecraft.world.level.material.MapColor -> eev:` 段列出 62 个常量
 *      （STONE/WOOD/GRASS/DIRT/SAND/SNOW/ICE/PLANT/WATER/NONE/COLOR_*…，**无 GLASS**）。
 *   3. 同仓自述：forge/1.20.1/knowledge/version-changes/1.20.x.md:36
 *      「1.20+ 已移除 `Material`；使用无参 `of()` + `mapColor`」。
 *   正解形态的本档一手出处：
 *      data/forge_1.20.4/forge-docs/1.20.4/processed/concepts_registries.md:25
 *      `new Block(BlockBehaviour.Properties.of().mapColor(MapColor.STONE))`
 *
 * 断言分两层：
 *  A. 内容层（任何数据根都跑，含 MC_SKILL_MAT_TEST_ROOT 假根）
 *     A1 只扫 forge/1.20.4 的**源稿**：`.cursor/rules/*.mdc`、`.cursor/skills/**`、
 *        `knowledge/**`、`code-patterns/**`、`scaffold/**`（.md/.mdc/.java）。
 *        7 份 IDE 投影（.agents/.claude/.continue/.opencode/.pi/.trae/.zcode）与
 *        `.cursor/agent/` 不扫 —— 一致性由 assert-skill-mirrors.mjs 保证。
 *     A2 禁用形态：
 *        - 常量引用 `(?<![A-Za-z0-9_$])Material\s*[.]\s*[A-Za-z_$]`
 *          （负向前查保证 `ArmorMaterial.IRON` / `MyArmorMaterial.COPPER` /
 *            `// items/MyArmorMaterial.java` 这类**合法** 1.20.4 名字不被误伤）
 *        - 工厂传参 `\b(?:of|create)\s*\(\s*Material\b`
 *          （`Properties.of(Material)`、`of(Material material)`、`create(Material.WOOD)`）
 *     A3 假绿兜底：被扫文件数为 0 = 红（换错根 / 档被搬走不等于零缺陷）。
 *  B. 台账层（只跑真数据根；TEST_ROOT 跳过；MC_SKILL_MAT_RELEDGER=1 只重算并打印、不判红）
 *     钉住「被扫文件数 / 命中数 / 合法豁免的 Armor 材质记号数 / 正解形态出现次数」，
 *     防止「正则被改瞎 → 零候选 → 零命中」或「把示例整段删空」蒙混过关。
 *     台账层还会复核前提：`data/forge_1.20.4/mappings/client.txt` 里 `block.material` 必须仍为
 *     0 次、`MapColor` 必须仍存在；哪天语料把 `Material` 类还回来，本门要显式重评而不是沉默放行。
 *
 * 用法：
 *   node scripts/assert-forge-1204-material.mjs
 *   MC_SKILL_MAT_RELEDGER=1 node scripts/assert-forge-1204-material.mjs      # 重算台账并打印新数
 *   MC_SKILL_MAT_TEST_ROOT=<假根> node scripts/assert-forge-1204-material.mjs # 投毒用
 *   MC_SKILL_MAT_GATE_INFO=1 node scripts/assert-forge-1204-material.mjs      # 打印命中清单
 *
 * 注：本 gate 只读知识库源稿，不依赖 dist，也不需要 npm run build。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, '..');
const REPO_ROOT = path.resolve(SERVER_ROOT, '..');

/** 测试假根：与 assert-scaffold-rules-conflict 的 MC_SKILL_SCAFFOLD_TEST_ROOT 同形态。 */
const TEST_ROOT = process.env.MC_SKILL_MAT_TEST_ROOT;
const ROOT = TEST_ROOT ? path.resolve(TEST_ROOT) : REPO_ROOT;
const RELEDGER = process.env.MC_SKILL_MAT_RELEDGER === '1';

const PACK_REL = path.join('forge', '1.20.4');
/** 7 份 IDE 投影 + `.cursor/agent`（同为投影），只查源稿。 */
const PROJECTION_DIRS = ['.agents', '.claude', '.continue', '.opencode', '.pi', '.trae', '.zcode'];
const SCAN_EXT = /\.(md|mdc|java)$/;

const BANNED = [
  {
    id: 'block-material-constant',
    re: new RegExp('(?<![A-Za-z0-9_$])Material\\s*[.]\\s*[A-Za-z_$]', 'g'),
    why: '方块 `Material` 常量在 1.20+ 已被移除；1.20.4 写 `Properties.of().mapColor(MapColor.X)`',
  },
  {
    id: 'block-material-factory-arg',
    re: /\b(?:of|create)\s*\(\s*Material\b/g,
    why: '`Properties.of/create` 在 1.20.4 只接受无参形态；材质位改 `.mapColor(MapColor…)`',
  },
];
/** 合法形态：`ArmorMaterial` / `MyArmorMaterial` 等 1.20.4 仍在世的成员（不得被上条误伤）。 */
const EXEMPT = new RegExp('[A-Za-z0-9_$]Material\\s*[.]\\s*[A-Za-z_$]', 'g');
/** 正解形态出现次数（假绿兜底：改对了才会有的数）。 */
const POSITIVE = [
  { id: 'mapColorCalls', re: /mapColor\s*\(/g },
  { id: 'propertiesOfNoArg', re: /Properties\.of\(\s*\)/g },
];

const failures = [];
const fail = (msg) => failures.push(msg);
const rel = (p) => path.relative(REPO_ROOT, p).split(path.sep).join('/');
const relPack = (p) => path.relative(ROOT, p).split(path.sep).join('/');

const packDir = path.join(ROOT, PACK_REL);
if (!fs.existsSync(packDir)) {
  console.error(`assert-forge-1204-material: 档目录不存在 ${relPack(packDir)}（根=${rel(ROOT) || '.'}）`);
  process.exit(1);
}

function collect(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (PROJECTION_DIRS.includes(e.name)) continue;
      if (p.endsWith(path.join('.cursor', 'agent'))) continue;
      collect(p, out);
    } else if (SCAN_EXT.test(e.name)) {
      out.push(p);
    }
  }
}

const files = [];
collect(packDir, files);
files.sort();

const hits = [];
const census = {
  filesScanned: files.length,
  bannedHits: 0,
  armorDotExempt: 0,
  mapColorCalls: 0,
  propertiesOfNoArg: 0,
};

// ── A. 内容层 ───────────────────────────────────────────────────────────
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(String.fromCharCode(10));
  census.armorDotExempt += (text.match(EXEMPT) || []).length;
  for (const pos of POSITIVE) census[pos.id] += (text.match(new RegExp(pos.re.source, 'g')) || []).length;
  for (const b of BANNED) {
    const re = new RegExp(b.re.source); // 逐行布尔判定 ⇒ 不带 g，避免 lastIndex 跨行残留
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\r$/, '');
      if (!re.test(line)) continue;
      census.bannedHits++;
      hits.push(`${relPack(file)}:${i + 1}: [${b.id}] ${line.trim().slice(0, 120)} — ${b.why}`);
    }
  }
}

for (const h of hits) fail(h);
if (census.filesScanned === 0) {
  fail(`根 ${rel(ROOT) || '.'} 下 ${PACK_REL.split(path.sep).join('/')} 没有可扫源稿 —— 零文件不等于零缺陷，检查换根路径`);
}

// ── B. 台账层 ───────────────────────────────────────────────────────────
const LEDGER = {
  filesScanned: 74,
  bannedHits: 0,
  armorDotExempt: 6,
  mapColorCalls: 18,
  propertiesOfNoArg: 21,
};

let premiseNote = 'skipped(test-root)';
if (!TEST_ROOT) {
  const got = {
    filesScanned: census.filesScanned,
    bannedHits: census.bannedHits,
    armorDotExempt: census.armorDotExempt,
    mapColorCalls: census.mapColorCalls,
    propertiesOfNoArg: census.propertiesOfNoArg,
  };
  if (RELEDGER) {
    console.log('  [reledger] 台账重算（把下面的数抄回 LEDGER 常量再提交）：');
    console.log(`    const LEDGER = ${JSON.stringify(got, null, 2).replace(/\n/g, String.fromCharCode(10) + '    ')};`);
  } else {
    for (const k of Object.keys(LEDGER)) {
      if (got[k] !== LEDGER[k]) {
        fail(`台账漂移: ${k}=${got[k]}，钉的是 ${LEDGER[k]}（本档源稿或禁用形态变了 → 复核后 MC_SKILL_MAT_RELEDGER=1 重钉）`);
      }
    }
  }

  // 前提复核：官方 1.20.4 映射里方块 Material 包必须仍然不存在，MapColor 必须仍然在。
  const clientTxt = path.join(ROOT, 'data', 'forge_1.20.4', 'mappings', 'client.txt');
  if (!fs.existsSync(clientTxt)) {
    premiseNote = 'premise-file-missing(未复核)';
  } else {
    const map = fs.readFileSync(clientTxt, 'utf8');
    const materialPkg = (map.match(/world[.]level[.]block[.]material/g) || []).length;
    const mapColorPresent = map.includes('net.minecraft.world.level.material.MapColor');
    if (materialPkg > 0 || !mapColorPresent) {
      fail(`前提被推翻：data/forge_1.20.4/mappings/client.txt 里 block.material=${materialPkg}、MapColor=${mapColorPresent} —— 语料变了，本门的禁用形态需要重评`);
    } else {
      premiseNote = 'ok(block.material=0 / MapColor 在场)';
    }
  }
}

if (process.env.MC_SKILL_MAT_GATE_INFO === '1') {
  for (const h of hits) console.log(`  info: ${h}`);
  console.log(`  info: files=${census.filesScanned} 命中=${census.bannedHits} 合法Armor材质记号(豁免)=${census.armorDotExempt} mapColor=${census.mapColorCalls} of()无参=${census.propertiesOfNoArg} 前提=${premiseNote} 根=${rel(ROOT) || '.'}`);
}

if (failures.length > 0) {
  console.error(
    `assert-forge-1204-material: ${failures.length} 项不通过（forge/1.20.4 源稿 ${census.filesScanned} 个文件 · ` +
      `残留方块 Material 形态 ${census.bannedHits} 处 · 台账 ${TEST_ROOT ? 'skipped(test-root)' : RELEDGER ? 'recomputed' : 'checked'}）`,
  );
  for (const f of failures.slice(0, 25)) console.error(`  ✗ ${f}`);
  if (failures.length > 25) console.error(`  …另有 ${failures.length - 25} 项`);
  process.exit(1);
}

console.log(
  `  assert-forge-1204-material: forge/1.20.4 源稿 ${census.filesScanned} 个文件 · 方块 Material 形态 0 · ` +
    `正解 mapColor ${census.mapColorCalls} / of() 无参 ${census.propertiesOfNoArg} · ` +
    `台账 ${TEST_ROOT ? 'skipped(test-root)' : RELEDGER ? 'recomputed' : 'checked'} · 前提 ${premiseNote}`,
);
