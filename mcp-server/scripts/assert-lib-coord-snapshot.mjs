#!/usr/bin/env node
/**
 * assert-lib-coord-snapshot.mjs — S5′ 的**零网络**门：`knowledge/libs` 手写坐标 ↔ 离线快照对账。
 *
 * 为什么不直接在门里发请求：本仓第 8 步链（`test-scripts.mjs`）有 wall-clock 断言（elapsed < 5000ms），
 * 门一旦碰网就变成「有网才绿」的装饰。所以网络只长在 `check-lib-coords.mjs`（opt-in 抓取器），
 * 门只读它在盘上留下的快照 `mcp-server/data/lib-coords/maven-metadata-snapshot.json`。
 * 采集正则**不复制第二份**：本文件 `import { collectClaims } from "./check-lib-coords.mjs"`
 * （先例：`assert-cross-layer-names.mjs` import `assert-skill-mappings-key.mjs`、
 * `assert-javadoc-build-provenance.mjs` import `fetch-forge-javadoc.js`）⇒ 抓取器与门永远同判据。
 *
 * ── 快照整份缺失时怎么办（必须显式表态的设计决策，2026-09-26 定）──────────────────────
 * **响亮判红**：rc=1 + `SNAPSHOT_MISSING`，并把再生命令原文念出来
 * （`node mcp-server/scripts/check-lib-coords.mjs --write`）。
 * 不采用仓内另一形状「leg → skipped，退出码不变」。理由有两条，第二条是要害：
 *   ① 快照是**入库产物**（`mcp-server/data/`，先例 `mdk-checksums.json`），正常克隆必带；
 *      「没有」只可能是两种病：从没跑过抓取器，或有人删了它 —— 两者都不是「环境不支持、可跳过」。
 *   ② skipped 不改退出码 = 本仓已登记的伪守卫形状：删掉快照即可把「坐标上游根本不存在」这类真错
 *      洗成绿。本门的修法不是只把缺失判红（那仍是一刀切的可绕过面），而是
 *      **C3 / C4 / 活性地板这三条腿压根不读快照**（只看 `knowledge/libs` 正文与槽位）⇒
 *      快照缺失时它们照跑照红，且 selftest 里有一记「缺快照 + 有真错」的洗白反证，
 *      断言红必须**同时**含 `SNAPSHOT_MISSING` 与该真错的判据名。缺一即 selftest 红。
 *
 * 五条判据（都可证伪；任一不满足即红）
 *   C1 覆盖/陈旧：当前采集到的每枚 `group:artifact` 与每个 positive 版本钉，快照里必须有对应行/对应
 *      `pinExistence` 键 ⇒ 缺 = 「快照过期，去跑抓取器」。反向孤儿行只打印不判红（删文档行不该逼抓取）。
 *   C2 版本实存：快照行 `found:true` 且 `pinExistence[v] === false` ⇒ 红（该版在我们真查过的 Central 上不存在）。
 *      ⚠️ **本仓当前覆盖面 = 0**（实测 3 枚唯一坐标全部 `source:"non-central"`，抓取器按规矩没查过任何仓库，
 *      所以快照里没有任何 `found:true` 行）⇒ C2 在真跑面上是**空转的等待腿**，其死活只由 selftest 夹具证明；
 *      任何人把「C2 绿」读成「坐标版本已对账」都是误读。它等的是第一枚点名仓库之外的坐标入库。
 *   C3 非 active 槽被当可用坐标：`versions.json` 里 `state !== "active"`（`commented` / `todo`）的槽位版本串，
 *      出现在任一 SKILL.md 的**未注释** Gradle 依赖声明行（C3a），或被写成 positive 的
 *      `group:artifact:<该版本>` 主张（C3b）⇒ 红。口径出处 = 根 AGENTS.md「`state != active` 一律不采纳」。
 *      C3c 另核槽位自身：`state` 不在 `{active, commented, todo}` 枚举里，或标称 `active` 却给不出版本串
 *      （coord 仍是 `TODO(未核实)`）⇒ 红 —— 这两种畸形都会让「非 active」的判定本身失去依据。
 *      C3d 管「坐标唯一真值」：该 `group:artifact` 若有 versions.json 槽位管辖，正文写出的 positive 版本
 *      必须等于某个 active 槽的 coord（去 `+fabric` 后比）⇒ 否则红；无 versions.json 的坐标不受管辖，跳过。
 *      （C1b 只保证快照登记过该主张，重跑抓取器会把编造版本登记成 `null` 而不再红 —— 拦住它的就是 C3d。）
 *      边界（写明不假装）：只判 `knowledge/libs/**`，不判各档投影手稿
 *      `fabric/<v>/.cursor/skills/mc-cloth-config.md` 的 `cloth-version-inject` 标记行 —— 那面由
 *      `mcp-server/test-core.mjs` §S14 + `scripts/project-cloth-skill.mjs` 钉。
 *   C4 采集器地板：SKILL.md 份数 / 坐标主张条数 / doc 条数 / 唯一坐标数 / 槽位条数 / 快照行数
 *      任一下界不满足即红；「0 条坐标」单独报 `COLLECTOR_RETURNED_ZERO` —— 那是采集器坏了，不是仓库干净。
 *   C5 快照出身：`schemaVersion` / `generatedBy` 不认 ⇒ 红（手写或外来的 JSON 不得充当对账凭据）。
 *
 * 用法
 *   node mcp-server/scripts/assert-lib-coord-snapshot.mjs              # 真跑（零网络）
 *   node mcp-server/scripts/assert-lib-coord-snapshot.mjs --selftest   # 内存投毒 + 真实正对照（零网络）
 *   MC_SKILL_LIBS_DIR=<副本目录> 只把**采集面**换掉（投毒用；快照路径不变；真跑会在结论行上方打一行 !! 声明）
 *   MC_SKILL_GATE_VERBOSE=1 逐例打印「命中在哪条判据上」（selftest 用，便于人复核红得对因）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CENTRAL_HOST, GENERATED_BY, SCHEMA_VERSION, SNAPSHOT_REL, collectClaims } from "./check-lib-coords.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
export const REGEN_COMMAND = "node mcp-server/scripts/check-lib-coords.mjs --write";

/**
 * 地板 = **下界**（`<` 才红），不是等式（等式棘轮会让下一次合法加坐标必红）。
 * 分母口径 = 本文件 `collectClaims()` 的返回，as-of 2026-09-26 实测：
 * SKILL.md 36 份 / 坐标主张 23 条（doc 9 + 槽位 14）/ 唯一 group:artifact 3 枚 / 快照行 3 行。
 * 地板取实测的约 2/3 ⇒ 采集器整体失灵（正则改坏、目录挪走、walk 早退）必红，正常增删单条不红。
 */
export const FLOORS = {
  skillFiles: 30,
  claims: 15,
  docClaims: 6,
  uniqueCoords: 2,
  slotClaims: 10,
  snapshotRows: 2,
  /** C3 的活性地板：语料里现存 2 个非 active 槽（1.14.4 todo / 1.19.4 commented），掉到 0 = C3 空转。 */
  nonActiveSlots: 2,
};

const DECL_LINE_RE = /(^|[^A-Za-z0-9_.-])(?:modApi|modImplementation|api|implementation|compileOnly|include|runtimeOnly|annotationProcessor|localRuntime|forgeRuntime)\s*[("']/;
const COMMENT_RE = /^\s*(?:\/\/|\*|#+)/;

function esc(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function isVersionToken(v) {
  const s = String(v || "");
  return /^\d/.test(s) && /\d/.test(s) && s.length >= 3 && !/见下表|同上|TODO/i.test(s);
}

/**
 * C3a：非 active 槽的版本串被写在**未注释**的依赖声明行里。
 * @param {Array<{slot:string,state:string,coord:string}>} slots
 * @param {Array<{rel:string,abs:string}>} docs
 */
export function checkSlotQuoting(slots, docs) {
  const problems = [];
  let examined = 0;
  const nonActive = slots.filter((s) => s.state !== "active");
  const versions = nonActive.filter((s) => isVersionToken(s.coord)).map((s) => ({ ...s }));
  for (const doc of docs) {
    let lines;
    try {
      // 夹具可以注入 `text`（内存行），生产路径读盘 —— **同一份判据函数**，不分叉。
      lines = (doc.text ?? fs.readFileSync(doc.abs, "utf8")).split(/\r?\n/);
    } catch (e) {
      problems.push(`C4：SKILL.md 读不到 ${doc.rel} —— ${e.message}`);
      continue;
    }
    lines.forEach((line, i) => {
      if (COMMENT_RE.test(line)) return; // 注释态给出坐标是**本仓口径要求的写法**，不判红
      if (!DECL_LINE_RE.test(line)) return;
      for (const slot of versions) {
        examined++;
        const re = new RegExp(`(?<![\\d.])${esc(slot.coord)}(?![\\d.])`);
        if (re.test(line)) {
          problems.push(
            `C3a：${doc.rel}:${i + 1} 在未注释的依赖声明里引用了 ` +
              `${slot.file} 的槽位 ${slot.slot}（state=${slot.state}，coord=${slot.coord}）—— ` +
              `根 AGENTS.md「版本标记是坐标唯一真值」规定 state != active 的槽一律不得采纳；` +
              `要启用请先改 versions.json 的 state 并补 basis，或把该行留在注释里。`,
          );
        }
      }
    });
  }
  return { problems, examined, nonActiveSlots: nonActive.length, quotableVersions: versions.length };
}

/** C3b：非 active 槽的版本串被写成 positive 的 `group:artifact:version` 主张。 */
export function checkSlotClaims(slots, claims) {
  const problems = [];
  const bad = new Map(slots.filter((s) => s.state !== "active" && isVersionToken(s.coord)).map((s) => [s.coord, s]));
  for (const c of claims) {
    if (c.kind !== "doc" || c.assertion !== "positive" || !c.version) continue;
    const hit = bad.get(c.version) || bad.get(String(c.version).split(/[+-]/)[0]);
    if (hit) {
      problems.push(
        `C3b：${c.source.file}:${c.source.line} 把 ${c.key}:${c.version} 当可用坐标写出，` +
          `但 ${hit.file} 的槽位 ${hit.slot} 是 state=${hit.state}（非 active）⇒ 不得采纳；` +
          `要么改槽位 state 并补 basis，要么改正文版本。`,
      );
    }
  }
  return problems;
}

/**
 * C3d：受 `versions.json` 管辖的坐标（该 key 有槽位），正文里写出的 **positive** 版本必须等于某个
 * `state:active` 槽的 coord（去 `+fabric` 后比）。这正是根 AGENTS.md「版本标记是坐标唯一真值 /
 * 中心稿表格不是取值入口」的离线执行处 —— C1b 只保证「快照登记过这条主张」，重跑抓取器就会把
 * 编造的版本登记成 `pinExistence:null`（non-central 不探），此后**只有本条腿**还能拦住它。
 * 不受管辖的 key（无 versions.json，如 Patchouli）不适用本条，跳过而不判红。
 */
export function checkSlotAsTruth(slots, claims) {
  const problems = [];
  const norm = (v) => String(v || "").split(/[+-]/)[0];
  const activeByKey = new Map();
  const governedKeys = new Set();
  for (const s of slots) {
    if (!s.key) continue;
    governedKeys.add(s.key);
    if (s.state === "active" && isVersionToken(s.coord)) {
      if (!activeByKey.has(s.key)) activeByKey.set(s.key, new Set());
      activeByKey.get(s.key).add(norm(s.coord));
    }
  }
  let applicable = 0;
  for (const c of claims) {
    if (c.kind !== "doc" || c.assertion !== "positive" || !c.version) continue;
    if (!governedKeys.has(c.key)) continue;
    applicable++;
    const allowed = activeByKey.get(c.key) || new Set();
    if (!allowed.has(norm(c.version))) {
      problems.push(
        `C3d：${c.source.file}:${c.source.line} 写出 ${c.key}:${c.version}，但该坐标由 versions.json 管辖，` +
          `其 active 槽里没有任何一版等于 ${norm(c.version)}（可用值：${[...allowed].sort().join(" / ") || "无 active 槽"}）。` +
          `根 AGENTS.md：坐标一律取 versions.json 对应 MC 版本的 slot，中心稿表格只是证据说明。`,
      );
    }
  }
  return { problems, applicable, governedKeys: [...governedKeys] };
}

/** C1 + C2 + C5：拿快照跟当前采集面对账。 */
export function checkAgainstSnapshot(snapshot, collected) {
  const problems = [];
  if (snapshot.schemaVersion !== SCHEMA_VERSION) {
    problems.push(`C5：快照 schemaVersion=${JSON.stringify(snapshot.schemaVersion)} ≠ ${SCHEMA_VERSION} ⇒ 不是本工具认的格式，不得充当对账凭据`);
  }
  if (snapshot.generatedBy !== GENERATED_BY) {
    problems.push(`C5：快照 generatedBy=${JSON.stringify(snapshot.generatedBy)} ≠ ${GENERATED_BY} ⇒ 手写/外来文件，拒绝采信`);
  }
  const rows = Array.isArray(snapshot.rows) ? snapshot.rows : [];
  const recClaims = Array.isArray(snapshot.claims) ? snapshot.claims : [];
  if (rows.length < FLOORS.snapshotRows) {
    problems.push(`C4：快照只有 ${rows.length} 行（地板 ${FLOORS.snapshotRows}）⇒ 抓取器采集面塌了，请重跑 \`${REGEN_COMMAND}\``);
  }
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const coords = [...new Set(collected.claims.filter((c) => c.key).map((c) => c.key))];
  const stale = [];
  for (const key of coords) {
    if (!byKey.has(key)) stale.push(key);
  }
  if (stale.length) {
    problems.push(
      `C1：${stale.length}/${coords.length} 枚文档坐标不在快照里（快照过期，或文档新增/改名了坐标）：${stale.join(", ")} —— ` +
        `坐标必须先在盘上登记才能离线对账：\`${REGEN_COMMAND}\``,
    );
  }
  // C1b：positive 版本钉必须有 pinExistence 键（`central-candidate` 与已绑定的槽位都算当前主张）
  const pinStale = [];
  for (const c of collected.claims) {
    if (!c.key || !c.version || c.assertion !== "positive") continue;
    const row = byKey.get(c.key);
    if (!row) continue; // 已由 C1a 报过
    if (!(c.version in (row.pinExistence || {}))) {
      pinStale.push(`${c.key}:${c.version}（${c.kind === "slot" ? `槽位 ${c.slot}` : `${c.source.file}:${c.source.line}`}）`);
    }
  }
  if (pinStale.length) {
    problems.push(
      `C1：${pinStale.length} 个 positive 版本钉在快照行里没有对账条目（快照过期）：${pinStale.slice(0, 6).join(", ")}` +
        `${pinStale.length > 6 ? " …" : ""} —— 跑 \`${REGEN_COMMAND}\` 重登记`,
    );
  }
  const recKeys = new Set(recClaims.map((c) => c.key));
  const orphans = rows.filter((r) => !recKeys.has(r.key));
  // C2：真的查过、真的没有
  for (const row of rows) {
    if (row.source === "control") continue;
    if (row.probeFailed) continue; // 探针失败 ≠ 上游没有（抓取器自己写了这条不变式）
    if (row.found !== true) continue;
    for (const [v, exists] of Object.entries(row.pinExistence || {})) {
      if (exists === false) {
        problems.push(
          `C2：${row.key}:${v} 在 ${row.host || CENTRAL_HOST} 的 maven-metadata.xml（共 ${row.upstreamVersionCount} 版，` +
            `latest=${row.latestRelease}，抓取于 ${row.fetchedAt}）里**不存在** ⇒ 文档钉了一个上游没有的版本。` +
            `改文档正文（门不改文档），或确认该构件另有私有仓库后把仓库 URL 写进 SKILL.md 让抓取器改判 non-central。`,
        );
      }
    }
  }
  return { problems, rowsFoundTrue: rows.filter((r) => r.found === true).length, orphans: orphans.length, orphanKeys: orphans.map((r) => r.key) };
}

const SLOT_STATES = new Set(["active", "commented", "todo"]);

/**
 * C3c：槽位自身的形状。`state` 不在枚举里 = 「非 active」的判定失去依据；
 * `state:active` 却给不出可采纳的版本串（`TODO(未核实)`）= 把未核实坐标标成已核实。
 */
export function checkSlotShape(slots) {
  const problems = [];
  for (const s of slots) {
    if (!SLOT_STATES.has(s.state)) {
      problems.push(`C3c：${s.file} 槽位 ${s.slot} 的 state=${JSON.stringify(s.state)} 不在枚举 {active, commented, todo} ⇒ 门的「非 active」判定不可信（拼错一个字母就会把 commented 读成非 active 的反面）`);
      continue;
    }
    if (s.state === "active" && !isVersionToken(s.coord)) {
      problems.push(`C3c：${s.file} 槽位 ${s.slot} 标称 state=active 但 coord=${JSON.stringify(s.coord)} 不是版本串 ⇒ 「active = 可采纳坐标」被标在了一个 TODO 上（AGENTS.md：todo 即 TODO(未核实)，禁止按邻居档推）`);
    }
  }
  return problems;
}

/** 采集面地板（C4）。 */
export function checkFloors(d) {
  const problems = [];
  if (!d || d.claims === 0) problems.push(`C4：COLLECTOR_RETURNED_ZERO —— 采集器一条坐标都没采到 = 它坏了，不是仓库干净（walk/正则/目录任一失效都会这样）`);
  for (const [k, floor] of Object.entries(FLOORS)) {
    if (k === "snapshotRows") continue;
    const now = d[k];
    if (typeof now !== "number" || now < floor) {
      problems.push(`C4：采集面 ${k}=${JSON.stringify(now)} 掉到地板 ${floor} 以下 ⇒ 采集器失能（不是「没有内容」）；地板口径见本文件 FLOORS 注释`);
    }
  }
  return problems;
}

export function readRepo() {
  const libsDir = process.env.MC_SKILL_LIBS_DIR || undefined;
  const collected = collectClaims(libsDir ? { libsDir } : {});
  const target = path.join(ROOT, SNAPSHOT_REL);
  const snapshotPresent = fs.existsSync(target);
  let snapshot = null;
  let snapshotError = null;
  if (snapshotPresent) {
    try {
      snapshot = JSON.parse(fs.readFileSync(target, "utf8"));
    } catch (e) {
      snapshotError = e.message;
    }
  }
  return { collected, snapshot, snapshotPresent, snapshotError, snapshotPath: SNAPSHOT_REL, libsOverride: process.env.MC_SKILL_LIBS_DIR || null };
}

export function evaluate(io) {
  const { collected, snapshot, snapshotPresent, snapshotError } = io;
  const problems = [];
  if (!snapshotPresent) {
    problems.push(`C0：SNAPSHOT_MISSING —— 离线快照不在盘上（${SNAPSHOT_REL}）。本门不跳过、不改口：` + `缺快照 = 没人对账过，不是「无需对账」。再生：\`${REGEN_COMMAND}\`（默认 dry-run，加 --write 落盘）`);
  } else if (snapshotError) {
    problems.push(`C0：快照存在但读不动（${SNAPSHOT_REL}）：${snapshotError} ⇒ 视同无凭据，重跑 \`${REGEN_COMMAND}\``);
  }
  // 这三条腿**不读快照**：删快照洗白不了它们（门头「缺失表态」第 ② 条的实现处）。
  problems.push(...checkFloors({ ...collected.denominators, nonActiveSlots: collected.slots.filter((s) => s.state !== "active").length }));
  const slotLeg = checkSlotQuoting(collected.slots, collected.docs);
  problems.push(...slotLeg.problems);
  if (slotLeg.nonActiveSlots < FLOORS.nonActiveSlots) {
    problems.push(`C4：非 active 槽只有 ${slotLeg.nonActiveSlots} 个（地板 ${FLOORS.nonActiveSlots}）⇒ C3 判据失去被检验对象，属空转腿`);
  }
  problems.push(...checkSlotClaims(collected.slots, collected.claims));
  const slotTruth = checkSlotAsTruth(collected.slots, collected.claims);
  problems.push(...slotTruth.problems);
  problems.push(...checkSlotShape(collected.slots));
  let snapLeg = { rowsFoundTrue: 0, orphans: 0 };
  if (snapshotPresent && !snapshotError) {
    snapLeg = checkAgainstSnapshot(snapshot, collected);
    problems.push(...snapLeg.problems);
  }
  return { problems, collected, slotLeg, snapLeg, truthLeg: slotTruth, snapshotPresent, libsOverride: io.libsOverride ?? null };
}

function printSummary(res, ms, mode) {
  const d = res.collected.denominators;
  const nonActive = res.collected.slots.filter((s) => s.state !== "active").length;
  console.log(
    `assert-lib-coord-snapshot(${mode}): ${res.problems.length ? "RED" : "ok"} · ${ms}ms · ` +
      `采集 SKILL.md ${d.skillFiles} 份 / versions.json ${d.slotFiles} 份 · 坐标主张 ${d.claims} 条（doc ${d.docClaims} + 槽位 ${d.slotClaims}，非 active 槽 ${nonActive}）· ` +
      `唯一坐标 ${d.uniqueCoords}（Central 候选 ${d.centralCandidates} / non-central ${d.nonCentral}）· ` +
      `快照 ${res.snapshotPresent ? "在盘" : "**缺失**"} · 已对账行 found:true ${res.snapLeg.rowsFoundTrue}（C2 覆盖面，0 = 等待腿）· ` +
      `C3a 可比版本 ${res.slotLeg.quotableVersions} 枚 × 声明行 = ${res.slotLeg.examined} 次比对 · 快照反向孤儿行 ${res.snapLeg.orphans ?? 0}（只提示）· ` +
      `C3d 受 versions.json 管辖的 positive 版本主张 ${res.truthLeg?.applicable ?? 0} 条（管辖坐标 ${res.truthLeg?.governedKeys?.length ?? 0} 枚）· ` +
      `地板 ${Object.entries(FLOORS).map(([k, v]) => `${k}≥${v}`).join(" ")}`,
  );
}

// ── --selftest：内存投毒（不写盘、不发请求、不 spawn CLI）────────────────────────────────
if (process.argv.includes("--selftest")) {
  const t0 = Date.now();
  const base = readRepo();
  const clean = evaluate(base);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const slotsOf = (o) => o.collected.slots;
  /**
   * C3a 夹具：把一行文本喂给**同一个** `checkSlotQuoting`（`doc.text` 注入口）。
   * 不在夹具里另写一份行级判据 —— 那会造成「夹具绿、生产红」的两套实现。
   */
  const c3aOn = (line) => checkSlotQuoting(slotsOf(base), [{ rel: "fixture/SKILL.md", text: line }]).problems;

  const cases = [
    {
      name: "C1 快照少一行（新增坐标没重跑抓取器）",
      want: /C1：.*不在快照里/,
      run: () => {
        const io = clone(base);
        io.snapshot.rows = io.snapshot.rows.filter((r) => r.key !== "vazkii.patchouli:patchouli-fabric");
        return evaluate(io).problems;
      },
    },
    {
      name: "C1 快照少一个版本钉（改了 versions.json 没重跑）",
      want: /C1：.*positive 版本钉/,
      run: () => {
        const io = clone(base);
        const row = io.snapshot.rows.find((r) => r.key === "me.shedaniel.cloth:cloth-config-fabric");
        delete row.pinExistence["11.1.136"];
        return evaluate(io).problems;
      },
    },
    {
      name: "C2 快照说钉的版本上游不存在",
      want: /C2：.*不存在/,
      run: () => {
        const io = clone(base);
        const row = io.snapshot.rows.find((r) => r.key === "me.shedaniel.cloth:cloth-config-fabric");
        row.source = "central";
        row.host = CENTRAL_HOST;
        row.found = true;
        row.upstreamVersionCount = 128;
        row.latestRelease = "26.2.155";
        row.fetchedAt = "2026-09-26T00:00:00Z";
        row.pinExistence["11.1.136"] = false;
        return evaluate(io).problems;
      },
    },
    {
      name: "C3b 非 active 槽被写成 positive 坐标主张",
      want: /C3b：/,
      run: () => {
        const io = clone(base);
        io.collected.claims.push({
          key: "me.shedaniel.cloth:cloth-config-fabric",
          group: "me.shedaniel.cloth",
          artifact: "cloth-config-fabric",
          kind: "doc",
          version: "10.0.96",
          rawVersion: "10.0.96",
          source: { file: "knowledge/libs/all-platforms/mc-config/SKILL.md", line: 42 },
          assertion: "positive",
          origin: "non-central",
          host: "maven.shedaniel.me",
          declared: true,
        });
        return evaluate(io).problems;
      },
    },
    {
      name: "C3c 槽位 state 拼错（不在枚举）",
      want: /C3c：.*不在枚举/,
      run: () => {
        const io = clone(base);
        io.collected.slots = io.collected.slots.map((s) => (s.slot === "1.19.4" ? { ...s, state: "commentd" } : s));
        return evaluate(io).problems;
      },
    },
    {
      name: "C3c 标称 active 却给 TODO 坐标",
      want: /C3c：.*标称 state=active/,
      run: () => {
        const io = clone(base);
        io.collected.slots = io.collected.slots.map((s) => (s.slot === "1.14.4" ? { ...s, state: "active", coord: "TODO(未核实)" } : s));
        io.collected.denominators = { ...io.collected.denominators, nonActiveSlots: io.collected.slots.filter((s) => s.state !== "active").length };
        return evaluate(io).problems;
      },
    },
    {
      name: "C3d 受管辖坐标被写出手编版本（不在任何 active 槽里）",
      want: /C3d：/,
      run: () => {
        const io = clone(base);
        io.collected.claims.push({
          key: "me.shedaniel.cloth:cloth-config-fabric",
          group: "me.shedaniel.cloth",
          artifact: "cloth-config-fabric",
          kind: "doc",
          version: "12.3.45",
          rawVersion: "12.3.45",
          source: { file: "knowledge/libs/all-platforms/mc-config/SKILL.md", line: 77 },
          assertion: "positive",
          origin: "non-central",
          host: "maven.shedaniel.me",
          declared: true,
        });
        return evaluate(io).problems;
      },
    },
    {
      name: "C3d 不判对照：写的正是某个 active 槽的版本",
      want: null,
      run: () => checkSlotAsTruth(base.collected.slots, [
        { key: "me.shedaniel.cloth:cloth-config-fabric", kind: "doc", assertion: "positive", version: "11.1.136", source: { file: "x/SKILL.md", line: 1 } },
      ]).problems,
    },
    {
      name: "C3d 不判对照：不受管辖的坐标（Patchouli 无 versions.json）",
      want: null,
      run: () => checkSlotAsTruth(base.collected.slots, [
        { key: "vazkii.patchouli:patchouli-fabric", kind: "doc", assertion: "positive", version: "100.0.1", source: { file: "x/SKILL.md", line: 1 } },
      ]).problems,
    },
    {
      name: "不判对照：Central 404（notOnCentral）只说明「不在 Central」，不得判红",
      want: null,
      run: () => {
        const io = clone(base);
        const row = io.snapshot.rows.find((r) => r.key === "me.shedaniel.cloth:cloth-config-fabric");
        Object.assign(row, { source: "central", host: CENTRAL_HOST, probed: true, found: false, notOnCentral: true, probeFailed: false, httpStatus: 404, pinExistence: Object.fromEntries(Object.keys(row.pinExistence).map((k) => [k, null])) });
        return evaluate(io).problems;
      },
    },
    {
      name: "不判对照：probeFailed 行（网络/TLS 失败）一律不下结论",
      want: null,
      run: () => {
        const io = clone(base);
        const row = io.snapshot.rows.find((r) => r.key === "me.shedaniel.cloth:cloth-config-fabric");
        Object.assign(row, { source: "central", probed: true, probeFailed: true, failureClass: "TIMEOUT", found: null, pinExistence: Object.fromEntries(Object.keys(row.pinExistence).map((k) => [k, null])) });
        return evaluate(io).problems;
      },
    },
    {
      name: "C4 采集面塌成 0 条",
      want: /COLLECTOR_RETURNED_ZERO|C4：采集面/,
      run: () => {
        const io = clone(base);
        io.collected.claims = [];
        io.collected.docs = [];
        io.collected.slots = [];
        io.collected.denominators = { ...io.collected.denominators, claims: 0, docClaims: 0, slotClaims: 0, uniqueCoords: 0, nonCentral: 0, centralCandidates: 0 };
        return evaluate(io).problems;
      },
    },
    {
      name: "C4 单一分母被掏空（只砍 uniqueCoords）",
      want: /C4：采集面 uniqueCoords/,
      run: () => {
        const io = clone(base);
        io.collected.denominators = { ...io.collected.denominators, uniqueCoords: 1 };
        return evaluate(io).problems;
      },
    },
    {
      name: "C5 外来/手写快照（generatedBy 不对）",
      want: /C5：快照 generatedBy/,
      run: () => {
        const io = clone(base);
        io.snapshot.generatedBy = "someone/handmade.mjs";
        return evaluate(io).problems;
      },
    },
    {
      name: "C5 schemaVersion 不认",
      want: /C5：快照 schemaVersion/,
      run: () => {
        const io = clone(base);
        io.snapshot.schemaVersion = 99;
        return evaluate(io).problems;
      },
    },
    {
      name: "C4 快照行数掉地板下",
      want: /C4：快照只有/,
      run: () => {
        const io = clone(base);
        io.snapshot.rows = io.snapshot.rows.slice(0, 1);
        return evaluate(io).problems;
      },
    },
    {
      name: "C4 非 active 槽清零 ⇒ C3 空转（腿死）",
      want: /C4：非 active 槽/,
      run: () => {
        const io = clone(base);
        io.collected.slots = io.collected.slots.map((s) => ({ ...s, state: "active" }));
        io.collected.denominators = { ...io.collected.denominators, nonActiveSlots: 0 };
        return evaluate(io).problems;
      },
    },
    {
      name: "C0 快照缺失 ⇒ 响亮红（点名再生命令）",
      want: /C0：SNAPSHOT_MISSING[\s\S]*check-lib-coords\.mjs --write/,
      run: () => {
        const io = clone(base);
        io.snapshotPresent = false;
        io.snapshot = null;
        return evaluate(io).problems;
      },
    },
    {
      name: "C0 洗白反证：删快照不得掩盖真错（须同时红 C0 与 C3b）",
      want: /C0：SNAPSHOT_MISSING/,
      extra: /C3b：/,
      run: () => {
        const io = clone(base);
        io.snapshotPresent = false;
        io.snapshot = null;
        io.collected.claims.push({
          key: "me.shedaniel.cloth:cloth-config-fabric",
          group: "me.shedaniel.cloth",
          artifact: "cloth-config-fabric",
          kind: "doc",
          version: "10.0.96",
          rawVersion: "10.0.96",
          source: { file: "knowledge/libs/all-platforms/mc-config/SKILL.md", line: 42 },
          assertion: "positive",
          origin: "non-central",
          host: "maven.shedaniel.me",
          declared: true,
        });
        return evaluate(io).problems;
      },
    },
    {
      name: "C3a 判据本体：未注释声明行引用非 active 槽版本",
      want: /C3a：/,
      run: () => c3aOn('    modImplementation("me.shedaniel.cloth:cloth-config-fabric:10.0.96")'),
    },
    {
      name: "C3a 不判对照：同一行留注释里 = 本仓要求的写法",
      want: null,
      run: () => c3aOn('    // include "me.shedaniel.cloth:cloth-config-fabric:10.0.96"'),
    },
    {
      name: "C3a 不判对照：active 槽版本写在声明行",
      want: null,
      run: () => c3aOn('    modApi("me.shedaniel.cloth:cloth-config-fabric:11.1.136")'),
    },
    {
      name: "C3a 不判对照：版本串出现在**非声明行**（正文/症状对照）",
      want: null,
      run: () => c3aOn('- 症状对照：`Could not find me.shedaniel.cloth:cloth-config-fabric:10.0.96`，该版本号上游不存在。'),
    },
  ];

  let missed = 0;
  for (const c of cases) {
    let got;
    try {
      got = c.run();
    } catch (e) {
      got = [`(抛错) ${e.message}`];
    }
    const blob = got.join("\n");
    if (process.env.MC_SKILL_GATE_VERBOSE && got.length) {
      const hit = (c.want ? blob.match(c.want) : null) || (c.extra ? blob.match(c.extra) : null);
      console.log(`  · 「${c.name}」→ ${got.length} 条，命中判据 ${hit ? hit[0] : "(未命中任何 want)"}${c.extra && !c.extra.test(blob) ? " ⇐ 但 extra 未命中" : ""}`);
    }
    if (c.want === null) {
      if (got.length) {
        missed++;
        console.error(`  ✗ selftest「${c.name}」应绿实红：${got[0]}`);
      }
      continue;
    }
    if (!c.want.test(blob) || (c.extra && !c.extra.test(blob))) {
      missed++;
      console.error(`  ✗ selftest「${c.name}」未红在该当的判据上（want=${c.want}${c.extra ? ` extra=${c.extra}` : ""}）：\n${blob.slice(0, 500)}`);
    }
  }
  // 正对照：真实仓库 + 真实快照必须 0 问题（防「一律红」式假判别力）
  if (clean.problems.length) {
    missed++;
    console.error(`  ✗ selftest 正对照：真实输入本应绿，实得 ${clean.problems.length} 条：`);
    for (const p of clean.problems.slice(0, 5)) console.error(`      ${p}`);
  }
  // C3a 的「读盘腿」也走一遍真文件，证明 fs 路径通（不写任何东西）
  const realLeg = checkSlotQuoting(slotsOf(base), base.collected.docs);
  if (realLeg.nonActiveSlots < 1) {
    missed++;
    console.error("  ✗ selftest：真实槽位清单里一个非 active 槽都没有 ⇒ 采集面与夹具脱节");
  }
  console.log(
    `\nassert-lib-coord-snapshot(selftest): ${missed === 0 ? "OK" : `${missed} 例不符`}（${cases.length} 例：${cases.filter((c) => c.want).length} 投毒必红 + ${cases.filter((c) => c.want === null).length} 不判对照 + 真实输入正对照 · C3a 读盘 ${realLeg.examined} 次比对 · ${Date.now() - t0}ms）`,
  );
  process.exit(missed === 0 ? 0 : 1);
}

const t0 = Date.now();
const res = evaluate(readRepo());
printSummary(res, Date.now() - t0, "真跑");
if (res.problems.length) {
  console.error(`assert-lib-coord-snapshot: RED（${res.problems.length} 条）`);
  for (const p of res.problems) console.error(`  - ${p}`);
  process.exit(1);
}
