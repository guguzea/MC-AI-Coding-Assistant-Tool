/**
 * assert-yarn-named-integrity：yarn tiny 的 **named 列完整性 ratchet**（2026-09-19，N-11.1 第③步）。
 *
 * 背景（temp/audit/sweep81/UNFIXED-REPORT-VERDICT.md §7）：上游 v1 导出件（`*-tiny.gz`）会丢
 * named —— 实测 1.21.1 34.15% 字段 / 1.21.11 35.69% 字段降级为 `named==intermediary`。管线把
 * selfEq 当「yarn 未命名」长期静默，导致 convert_mapping 查不到 `MAX_HEALTH` 这类真实命名。
 * 2026-09-19 已按上游 `-v2.jar` 逐行重写 named 列（13 档，备份+provenance 落在各 `mappings/`）。
 *
 * 本门（纯只读），5 条判据：
 *   1) 每档 `mappings/yarn-tiny-provenance.json` 必须存在（修复可追溯）；
 *      **前置面收口（2026-09-19 裁定）**：`data/fabric_<ver>/mappings/` 存在却找不到 `-tiny.gz` 时**判红**，
 *      不再静默跳过 —— 「本档不带 mappings/ 目录」（如 fabric_26.1.2 / fabric_porting，设计如此）
 *      与「带了 mappings/ 却缺工件」是两回事，后者意味着判据 1–4 对整档根本没跑。
 *   2) 当前 member selfEq 比率 ≤ 修复基线 × 1.15（防再次喂有损 artifact —— 有损态会高出 ~50% 相对量）；
 *      **空过收口（2026-09-19 裁定）**：member 行数为 0 时比率无从计算（旧式 `memberTotal ? … : 0`
 *      会把它判成 0% 静默通过）⇒ 判红（工件被截断/换件，与「yarn 未命名」不可区分）。
 *   3) class selfEq 绝对数 ≤ 200；
 *   4) 零成员类 ≤ 逐档基线 × 1.15 + 30（按 ownerOfficial 列归因；捕获「CLASS 行在、成员行整批缺失」）；
 *   5) provenance ↔ 磁盘双向 sha 对账：`upstreamV1.sha256` 必须等于 `mappings/upstream/*.bak` 的实测
 *      sha256；`repairedSha256` 必须等于盘上 `*-tiny.gz` 的实测 sha256（备份缺失 / 字段缺失 / 不等 = 红）。
 * 基线 = 2026-09-19 修复完成实测，外置在同目录 `yarn-named-baseline.json`（文件或字段缺失 = 红）；
 * 阈值只许**收紧**，放宽需附新证据。
 *
 * 用法：
 *   node scripts/assert-yarn-named-integrity.mjs                    # 判红/绿（打印逐档一行）
 *   node scripts/assert-yarn-named-integrity.mjs --measure-zero-member
 *       # 只读重算各档零成员类计数：打印可直接提交的基线表 JSON + 现基线 vs 实测对照（不写盘，退出码 0）
 *   node scripts/assert-yarn-named-integrity.mjs --selftest
 *       # 投毒自证：在 $TMP 造 8 例夹具（1 正对照 + 7 类畸形），用**真门**（child process）逐例断言 rc，
 *       # 跑完即删；不碰仓库 data/。判据活性由此证明，而不是靠「它一直没红」。
 * 投毒专用环境变量（生产链不设，只由 --selftest 与 test 链的投毒块使用）：
 *   MC_SKILL_YARN_GATE_ROOT=<假根>        # 顶替仓库根（门只读 <假根>/data/fabric_<ver>/mappings）
 *   MC_SKILL_YARN_GATE_BASELINE=<文件>    # 顶替基线 JSON 路径
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
// 假根/假基线只服务投毒自证（与 assert-scaffold-selfcheck / assert-legacy-isolation 同惯例）。
const TEST_ROOT = process.env.MC_SKILL_YARN_GATE_ROOT ? path.resolve(process.env.MC_SKILL_YARN_GATE_ROOT) : null;
const ROOT = TEST_ROOT ?? REPO;
const DATA = path.join(ROOT, "data");
const BASELINE_PATH = process.env.MC_SKILL_YARN_GATE_BASELINE
  ? path.resolve(process.env.MC_SKILL_YARN_GATE_BASELINE)
  : path.join(HERE, "yarn-named-baseline.json");
const FACTOR = 1.15;
const CLASS_SELF_EQ_CAP = 200;
const ZERO_MEMBER_SLACK = 30; // 绝对余量（对抗版本内小改动的抖动）
const MEASURE = process.argv.includes("--measure-zero-member");

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

/**
 * 基线外置（同目录 yarn-named-baseline.json，风格同 corpus-semantics-baseline.json）。
 * 门模式（!MEASURE）：文件 / 表字段缺失 = 直接红退出（strict）；measure 模式宽松读取（仅用于对照）。
 */
function loadBaseline(strict) {
  if (!fs.existsSync(BASELINE_PATH)) {
    if (strict) {
      console.error(`assert-yarn-named-integrity: RED —— 基线文件缺失：${path.relative(REPO, BASELINE_PATH).split(path.sep).join("/")}`);
      process.exit(1);
    }
    return null;
  }
  let json;
  try {
    json = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
  } catch (e) {
    if (strict) {
      console.error(`assert-yarn-named-integrity: RED —— 基线文件解析失败（${e.message}）：${path.relative(REPO, BASELINE_PATH).split(path.sep).join("/")}`);
      process.exit(1);
    }
    return null;
  }
  const member = json.memberSelfEqRatio;
  const zero = json.zeroMemberClasses;
  if (strict) {
    if (!member || typeof member !== "object" || Array.isArray(member)) {
      console.error(`assert-yarn-named-integrity: RED —— 基线缺 memberSelfEqRatio 表：${path.relative(REPO, BASELINE_PATH).split(path.sep).join("/")}`);
      process.exit(1);
    }
    if (!zero || typeof zero !== "object" || Array.isArray(zero)) {
      console.error(`assert-yarn-named-integrity: RED —— 基线缺 zeroMemberClasses 表：${path.relative(REPO, BASELINE_PATH).split(path.sep).join("/")}`);
      process.exit(1);
    }
  }
  return { member: member && typeof member === "object" ? member : {}, zero: zero && typeof zero === "object" ? zero : {} };
}

function scanTiny(txt) {
  let classSelfEq = 0,
    classTotal = 0,
    memberSelfEq = 0,
    memberTotal = 0;
  for (const l of txt.split(/\r?\n/)) {
    if (l.startsWith("CLASS\t")) {
      const p = l.split("\t");
      classTotal++;
      if (p[3] === p[2]) classSelfEq++;
    } else if (l.startsWith("FIELD\t") || l.startsWith("METHOD\t")) {
      const p = l.split("\t");
      memberTotal++;
      if (p[5] === p[4]) memberSelfEq++;
    }
  }
  return { classSelfEq, classTotal, memberSelfEq, memberTotal };
}

/**
 * 零成员类扫描（第 4 判据）：CLASS 行在，但按 **ownerOfficial 列** 归因后 METHOD/FIELD 全 0 的类。
 * 扁平布局档（1.14.4–1.19.4）必须用 owner 列（近邻归因会把成员全算给最后一个类）；
 * owner 不在 CLASS 表时回退近邻（容错，并在计数上不额外惩罚）。
 */
function scanZeroMember(txt) {
  const classes = new Map();
  let cur = null;
  for (const l of txt.split(/\r?\n/)) {
    if (l.startsWith("CLASS\t")) {
      const p = l.split("\t");
      cur = p[1];
      classes.set(cur, { m: 0, f: 0 });
    } else if (l.startsWith("METHOD\t") || l.startsWith("FIELD\t")) {
      const p = l.split("\t");
      const owner = classes.has(p[1]) ? p[1] : cur;
      if (!owner || !classes.has(owner)) continue;
      const v = classes.get(owner);
      if (l.startsWith("METHOD\t")) v.m++;
      else v.f++;
    }
  }
  let zero = 0;
  for (const [, v] of classes) if (v.m === 0 && v.f === 0) zero++;
  return { zero };
}

/** 发现全部档：data/ 下各 fabric_&lt;ver&gt; 档 mappings/ 里带 -tiny.gz 的（含档名、mappings 目录、tiny 文件名）。 */
/**
 * 发现全部档：data/ 下各 fabric_<ver> 档 mappings/ 里带 -tiny.gz 的（含档名、mappings 目录、tiny 文件名）。
 *
 * 同时**显式登记**「有 mappings/ 却没有 -tiny.gz」的档 —— 这才是洞①的收口点：
 * 旧版 `if (!tinyName) continue` 把这类档静默跳过，判据 1–5 对它一条都没跑，而门照报 ok。
 * 「没有 mappings/ 目录」仍然跳过（fabric_26.1.2 / fabric_porting 本就不带映射工件，是设计不是漏检）。
 */
function discoverPacks() {
  const packs = [];
  const missingTiny = [];
  for (const pack of fs.readdirSync(DATA).filter((d) => d.startsWith("fabric_")).sort()) {
    const dir = path.join(DATA, pack, "mappings");
    if (!fs.existsSync(dir)) continue;
    const tinyName = fs.readdirSync(dir).find((f) => /-tiny\.gz$/.test(f));
    if (!tinyName) {
      missingTiny.push(pack);
      continue;
    }
    packs.push({ pack, dir, tinyName });
  }
  return { packs, missingTiny };
}

/**
 * 第 5 判据（provenance ↔ 磁盘双向 sha 对账）：provenance 存在时，
 *   a) `upstreamV1.sha256` == `mappings/<upstreamV1.file>`（即 upstream/*.bak）实测 sha256；
 *   b) `repairedSha256` == 盘上 `*-tiny.gz` 实测 sha256。
 * 备份缺失 / provenance 字段缺失 / 任一不等 → 返回错误行（失败计数与退出码走门内既有通道）。
 */
function checkProvenanceSha(pack, dir, tinyName) {
  const errs = [];
  let prov;
  try {
    prov = JSON.parse(fs.readFileSync(path.join(dir, "yarn-tiny-provenance.json"), "utf8"));
  } catch (e) {
    errs.push(`${pack}: yarn-tiny-provenance.json 解析失败（${e.message}）`);
    return errs;
  }
  const upV1 = prov && typeof prov === "object" ? prov.upstreamV1 : undefined;
  const bakRel = upV1 && upV1.file;
  const upSha = upV1 && upV1.sha256;
  if (!bakRel || !upSha) {
    errs.push(`${pack}: provenance 缺 upstreamV1.file / upstreamV1.sha256（判据 5 无法对账）`);
  } else {
    const bakAbs = path.join(dir, bakRel);
    const inside = path.relative(dir, bakAbs);
    if (inside.startsWith("..") || path.isAbsolute(inside)) {
      errs.push(`${pack}: provenance.upstreamV1.file 越出 mappings/ 目录：${bakRel}`);
    } else if (!fs.existsSync(bakAbs)) {
      errs.push(`${pack}: provenance 指向的上游备份缺失：mappings/${bakRel.split(path.sep).join("/")}（named 修复不可追溯）`);
    } else {
      const got = sha256(fs.readFileSync(bakAbs));
      if (got !== upSha) {
        errs.push(
          `${pack}: 上游 v1 备份 sha256 对账失败 want=${upSha} got=${got}` +
            `（mappings/${bakRel.split(path.sep).join("/")} 被替换 / 重拉了上游 v1？）`,
        );
      }
    }
  }
  const repSha = prov ? prov.repairedSha256 : undefined;
  if (typeof repSha !== "string" || !repSha) {
    errs.push(`${pack}: provenance 缺 repairedSha256（判据 5 无法对账）`);
  } else {
    const got = sha256(fs.readFileSync(path.join(dir, tinyName)));
    if (got !== repSha) {
      errs.push(
        `${pack}: 盘上 tiny sha256 对账失败 want=${repSha} got=${got}（mappings/${tinyName} 与 provenance 不一致 —— tiny 被重拉 / 重新生成过？）`,
      );
    }
  }
  return errs;
}

// ── --selftest：投毒自证（纯 $TMP 夹具，不碰仓库 data/；跑完即删）───────────────────────
// 立此块的缘由（2026-09-19 用户裁定「收口两个洞 + 补投毒」）：本门此前**没有任何投毒证明**，
// 于是「门一直绿」既可能是数据好、也可能是判据已经死了（classSelfEq ≤ 200 对本次重建就完全惰性）。
// 做法：把**真门**当被测对象（child process + MC_SKILL_YARN_GATE_ROOT 假根），逐例投毒断言退出码，
// 正对照必须绿 —— 判据活性由「真跑」证明，而不是在原地另写一套判分逻辑自说自话。
if (process.argv.includes("--selftest")) {
  const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), "mc-yarn-gate-selftest-"));
  const PK = "fabric_9.9.9";
  const gz = (s) => zlib.gzipSync(Buffer.from(s, "utf8"));
  const cls = (official, named) => `CLASS\t${official}\tofficial/${official}\t${named}\n`;
  const mem = (kind, owner, official, named) =>
    `${kind}\t${owner}\t()V\tn.o.${official}\tn.i.${official}\t${named}\n`;
  /** 健康档：3 类 × 4 成员，named 列与 intermediary 列全不同（member/class selfEq 皆 0） */
  const healthyTiny = () => {
    let s = "";
    for (let c = 0; c < 3; c++) {
      s += cls(`C${c}`, `NamedC${c}`);
      for (let m = 0; m < 4; m++) s += mem(m % 2 ? "FIELD" : "METHOD", `C${c}`, `m${c}_${m}`, `namedM${c}_${m}`);
    }
    return s;
  };
  /** 有损 v1 形态：成员 named 列 == intermediary 列（比率 100%，判据②必须咬住） */
  const lossyTiny = () => {
    let s = "";
    for (let c = 0; c < 3; c++) {
      s += cls(`C${c}`, `NamedC${c}`);
      for (let m = 0; m < 4; m++) s += mem("METHOD", `C${c}`, `m${c}_${m}`, `n.i.m${c}_${m}`);
    }
    return s;
  };
  /** 只有 CLASS 行、没有任何成员行（memberTotal=0 ⇒ 洞②必须咬住；旧式 `? : 0` 会静默放行） */
  const classesOnlyTiny = () => [0, 1, 2].map((c) => cls(`C${c}`, `NamedC${c}`)).join("");
  /** 1 类有成员 + 40 类无成员（zero=40 > ceil(0×1.15)+30 ⇒ 判据④必须咬住） */
  const zeroBatchTiny = () => {
    let s = cls("C0", "NamedC0");
    for (let m = 0; m < 4; m++) s += mem("METHOD", "C0", `m${m}`, `namedM${m}`);
    for (let c = 1; c <= 40; c++) s += cls(`Z${c}`, `NamedZ${c}`);
    return s;
  };
  const newRoot = (tag) => {
    const root = path.join(tmpBase, tag, "root");
    fs.mkdirSync(path.join(root, "data"), { recursive: true });
    return root;
  };
  /** 造一档：<root>/data/<pack>/mappings/{tiny.gz, upstream/*.bak, provenance.json}；noProv 时由调用方写 provenance */
  const seed = (root, tinyText, opts = {}) => {
    const dir = path.join(root, "data", opts.pack ?? PK, "mappings");
    fs.mkdirSync(path.join(dir, "upstream"), { recursive: true });
    const bakRel = "upstream/yarn-9.9.9-tiny.gz.v1-upstream.gz.bak";
    const bakBuf = gz(healthyTiny());
    fs.writeFileSync(path.join(dir, bakRel), bakBuf);
    let tinySha = "0".repeat(64);
    if (!opts.skipTiny) {
      const tinyBuf = gz(tinyText);
      fs.writeFileSync(path.join(dir, "yarn-9.9.9-tiny.gz"), tinyBuf);
      tinySha = sha256(tinyBuf);
    }
    const bakSha = sha256(bakBuf);
    if (!opts.noProv) {
      fs.writeFileSync(
        path.join(dir, "yarn-tiny-provenance.json"),
        JSON.stringify({ upstreamV1: { file: bakRel, sha256: bakSha }, repairedSha256: tinySha }),
      );
    }
    return { dir, bakRel, bakSha, tinySha };
  };
  const baselineOf = (ratio, zero) => ({ memberSelfEqRatio: { [PK]: ratio }, zeroMemberClasses: { [PK]: zero } });
  const runGate = (root, baseline) => {
    const bl = path.join(root, "baseline.json");
    fs.writeFileSync(bl, JSON.stringify(baseline));
    return spawnSync(process.execPath, [fileURLToPath(import.meta.url)], {
      encoding: "utf8",
      windowsHide: true,
      env: { ...process.env, MC_SKILL_YARN_GATE_ROOT: root, MC_SKILL_YARN_GATE_BASELINE: bl },
    });
  };
  const cases = [
    ["正对照·健康档", (r) => (seed(r, healthyTiny()), baselineOf(0, 0)), 0],
    ["判据②·有损 v1（named==intermediary）", (r) => (seed(r, lossyTiny()), baselineOf(0, 0)), 1],
    ["洞②·memberTotal=0（空 member 列）", (r) => (seed(r, classesOnlyTiny()), baselineOf(0, 0)), 1],
    ["判据④·零成员类批量超限", (r) => (seed(r, zeroBatchTiny()), baselineOf(0, 0)), 1],
    [
      "洞①·mappings/ 在却无 -tiny.gz",
      (r) => {
        // 必须同时放一档**健康**档：否则 packs 为空时旧版会走「发现逻辑失效」分支而报红，
        // 测不出「有别的档在跑 ⇒ 缺工件那档被静默跳过」这个真形态（旧版在此夹具下是绿的）。
        seed(r, healthyTiny());
        seed(r, "", { pack: `${PK}_missing`, skipTiny: true });
        return baselineOf(0, 0);
      },
      1,
    ],
    [
      "判据⑤·repaired sha 不符",
      (r) => {
        const s = seed(r, healthyTiny(), { noProv: true });
        fs.writeFileSync(
          path.join(s.dir, "yarn-tiny-provenance.json"),
          JSON.stringify({ upstreamV1: { file: s.bakRel, sha256: s.bakSha }, repairedSha256: "b".repeat(64) }),
        );
        return baselineOf(0, 0);
      },
      1,
    ],
    [
      "判据⑤·上游备份缺失",
      (r) => {
        const s = seed(r, healthyTiny(), { noProv: true });
        fs.writeFileSync(
          path.join(s.dir, "yarn-tiny-provenance.json"),
          JSON.stringify({ upstreamV1: { file: "upstream/absent.bak", sha256: s.bakSha }, repairedSha256: s.tinySha }),
        );
        return baselineOf(0, 0);
      },
      1,
    ],
    ["基线·新档未登记", (r) => (seed(r, healthyTiny()), { memberSelfEqRatio: {}, zeroMemberClasses: {} }), 1],
  ];
  let missed = 0;
  try {
    for (const [name, build, want] of cases) {
      const root = newRoot(name.replace(/[^\w\u4e00-\u9fa5]+/g, "_"));
      const r = runGate(root, build(root));
      const rc = r.status ?? 1;
      if (rc !== want) {
        missed++;
        const tail = `${r.stdout ?? ""}${r.stderr ?? ""}`
          .trim()
          .split(/\r?\n/)
          .filter(Boolean)
          .slice(-3)
          .join(" | ");
        console.error(`  ✗ selftest「${name}」期望 rc=${want}，实得 rc=${rc}${tail ? ` —— ${tail.slice(0, 300)}` : ""}`);
      } else {
        console.log(`  ✓ ${name}（rc=${rc}）`);
      }
    }
  } finally {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }
  console.log(
    `\nassert-yarn-named-integrity(selftest): ${
      missed === 0
        ? `OK（${cases.length} 例全符：1 正对照绿 + ${cases.length - 1} 类畸形全检出；$TMP 夹具已删）`
        : `${cases.length - missed}/${cases.length} 例相符`
    }`,
  );
  process.exit(missed === 0 ? 0 : 1);
}

const BASELINE = loadBaseline(!MEASURE);
const { packs, missingTiny } = discoverPacks();

// ── --measure-zero-member：只读重算零成员类基线（不写盘，退出码 0）──────────────────────
if (MEASURE) {
  const measured = {};
  const lines = [];
  for (const { pack, dir, tinyName } of packs) {
    let zero = null;
    try {
      zero = scanZeroMember(zlib.gunzipSync(fs.readFileSync(path.join(dir, tinyName))).toString("utf8")).zero;
    } catch (e) {
      lines.push(`  ${pack}  gunzip 失败（${e.message}）—— 不计入实测`);
      continue;
    }
    measured[pack] = zero;
    const cur = BASELINE ? BASELINE.zero[pack] : undefined;
    const cap = typeof cur === "number" ? Math.ceil(cur * FACTOR) + ZERO_MEMBER_SLACK : null;
    const verdict = cap === null ? "未登记" : zero <= cap ? "ok" : "超限";
    lines.push(
      `  ${pack}  现基线=${cur ?? "?"}  实测=${zero}  ratchet上限=${cap ?? "?"}（ceil(基线×${FACTOR})+${ZERO_MEMBER_SLACK}）  ${verdict}`,
    );
  }
  console.log(
    `[MEASURE] 零成员类重算（${packs.length} 档，只读不写盘；实测日期 ${new Date().toISOString().slice(0, 10)}）——` +
      `可直接提交的基线表（替换 yarn-named-baseline.json 的 "zeroMemberClasses" 字段）：`,
  );
  console.log(JSON.stringify({ zeroMemberClasses: measured }, null, 2));
  console.log("");
  if (missingTiny.length) {
    console.log(`[MEASURE] ⚠ 另有 ${missingTiny.length} 档有 mappings/ 却无 -tiny.gz（门模式下判红）：${missingTiny.join(", ")}`);
  }
  console.log(`[MEASURE] 现基线 vs 实测对照：`);
  for (const l of lines) console.log(l);
  process.exit(0);
}

// ── 门模式：5 条判据 ─────────────────────────────────────────────────────────────────────
const errors = [];
const rows = [];
for (const { pack, dir, tinyName } of packs) {
  // gunzip 失败不炸栈：named/selfEq/零成员三系判据跳过，判据 5 的 sha 对账仍按原始字节执行
  let tinyText = null;
  try {
    tinyText = zlib.gunzipSync(fs.readFileSync(path.join(dir, tinyName))).toString("utf8");
  } catch (e) {
    errors.push(`${pack}: mappings/${tinyName} gunzip 失败（${e.message}）—— tiny 已损坏或被换件`);
  }
  const tiny = tinyText === null ? { classSelfEq: 0, classTotal: 0, memberSelfEq: 0, memberTotal: 0 } : scanTiny(tinyText);
  const ratio = tiny.memberTotal ? tiny.memberSelfEq / tiny.memberTotal : 0;
  // 洞②收口（2026-09-19 裁定）：`memberTotal === 0` 时上式把比率算成 0% ⇒ 判据②静默通过。
  // 空 member 列与「yarn 未命名」不可区分，必须red —— 否则一个只剩 CLASS 行的截断工件能骗过整道门。
  if (tinyText !== null && tiny.memberTotal === 0) {
    errors.push(
      `${pack}: tiny 里 FIELD/METHOD 行数为 0（判据②无从计算、旧式写法会静默判成 0%）—— 工件被截断/换件？`,
    );
  }
  const base = BASELINE.member[pack];
  if (tinyText !== null) rows.push(`${pack} ${(ratio * 100).toFixed(2)}%`);
  const provPath = path.join(dir, "yarn-tiny-provenance.json");
  const provExists = fs.existsSync(provPath);
  if (!provExists) errors.push(`${pack}: 缺 mappings/yarn-tiny-provenance.json（named 修复不可追溯）`);
  if (base === undefined) errors.push(`${pack}: 不在基线表中（新档须先完成 named 源核验并登记）`);
  else if (ratio > base * FACTOR) {
    errors.push(
      `${pack}: member selfEq ${(ratio * 100).toFixed(2)}% > 基线 ${(base * 100).toFixed(2)}% × ${FACTOR}` +
        ` —— 疑似再次摄入有损 tiny（修法见 UNFIXED-REPORT-VERDICT.md §7）`,
    );
  }
  if (tiny.classSelfEq > CLASS_SELF_EQ_CAP) {
    errors.push(`${pack}: class selfEq=${tiny.classSelfEq} > ${CLASS_SELF_EQ_CAP}`);
  }
  // 第 4 判据（N-11.2）：零成员类 ratchet —— 捕获「CLASS 行在、成员行整批缺失」的相对形态
  const zero = tinyText === null ? 0 : scanZeroMember(tinyText).zero;
  const zeroBase = BASELINE.zero[pack];
  if (zeroBase === undefined) {
    errors.push(`${pack}: 不在零成员基线表中（新档先 --measure-zero-member 并登记）`);
  } else {
    const cap4 = Math.ceil(zeroBase * FACTOR) + ZERO_MEMBER_SLACK;
    if (zero > cap4) {
      errors.push(
        `${pack}: 零成员类 ${zero} > 基线 ${zeroBase}×${FACTOR}+${ZERO_MEMBER_SLACK}（=${cap4}） —— 疑似 v1 有损（成员整批缺失）`,
      );
    } else if (tinyText !== null) {
      // gunzip 失败的档不进 rows（已由 gunzip 错误行点名），避免把 zero=0 拼到上一档的行尾
      rows[rows.length - 1] = `${rows[rows.length - 1]} zero=${zero}`;
    }
  }
  // 第 5 判据：provenance ↔ 磁盘双向 sha 对账（备份字节 + 修复产物字节都不可漂移）
  if (provExists) {
    errors.push(...checkProvenanceSha(pack, dir, tinyName));
  }
}
// 洞①收口（2026-09-19 裁定）：有 mappings/ 却没有 -tiny.gz 的档必须点名判红，不再静默跳过。
for (const pack of missingTiny) {
  errors.push(`${pack}: 有 mappings/ 却找不到 -tiny.gz —— 判据 1–5 对该档一条都没跑（缺工件 ≠ 本档不带映射）`);
}
if (!packs.length && !missingTiny.length) {
  console.error("assert-yarn-named-integrity: RED —— data/fabric_*/mappings 下找不到任何 -tiny.gz（发现逻辑失效）");
  process.exit(1);
}
if (errors.length) {
  console.error(`assert-yarn-named-integrity: RED（${errors.length} 条）`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `assert-yarn-named-integrity: ok（${rows.length} 档 · 全部有 provenance 且 selfEq ≤ 基线×${FACTOR}` +
    ` · 零成员类 ≤ 基线×${FACTOR}+${ZERO_MEMBER_SLACK} · provenance↔磁盘 sha 对账一致` +
    ` · 无「有 mappings/ 却缺 -tiny.gz」的档 · 无 memberTotal=0 的空过档；--selftest 可投毒自证）`,
);
console.log(`  比率/零成员: ${rows.join(" · ")}`);
