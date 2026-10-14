/**
 * 多客户端联合判读器（playtest multi-client joint verdict）。
 *
 * 为什么单独一件：单客户端的 `inspect_playtest_evidence` 是**每目录各自三态**，
 * 而多会话场景的判绿条件是**联合**的 —— 任一客户端缺件/判红，整轮就是红；
 * 且必须能看出来「哪个客户端在哪一步掉的队」，所以除了逐客户端三态还要出**锚点**与**会合 marker**。
 *
 * 授权（三通道，见根 AGENTS.md「人在环例外：游玩自测」）：
 *   MC_SKILL_PLAYTEST_ALLOW=1 + MC_SKILL_PLAYTEST_ROOT=<绝对路径>；
 *   **每个客户端的证据目录 realpath 都必须落在根内**（任一越界 ⇒ 整体拒，不逐客户端放行）。
 *
 * 判绿口径（fail-closed，三条都要满足）：
 *   ① clients.length ≥ 1（不给客户端 = 没测，不判绿）；
 *   ② 每个客户端 exit-code.txt = `0`、state.json 与 qa.log 都 present 可读；
 *   ③ 若给了 expectMarkers，则每个 marker 都在 `<evidenceRoot>/sync/` 下 present。
 * 缺件一律读作 `absent` / `unreadable`，**不得**读成「没有失败」。
 *
 * 会合原语在 driver 侧：剧本里 `touch <共享目录绝对路径>/<name>` + `waitfile <同路径> max=<ticks>`。
 */
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { isAbsolute, join, resolve } from "path";
import { isInsideReal, nativeReal } from "../utils/project-sandbox.js";

export type EvidenceState = "present" | "absent" | "unreadable";

export interface PlaytestMultiClient {
  /** 客户端别名（如 clientA / clientB）；缺省用目录名。 */
  id?: string;
  /** 该客户端的证据目录（绝对路径；须在授权根内）。 */
  evidenceDir: string;
}

export interface PlaytestMultiQuery {
  /** 父目录：自动把它的**直接子目录**当客户端（与显式给 clients 二选一）。 */
  evidenceRoot?: string;
  clients?: PlaytestMultiClient[];
  /** 会合 marker 名（相对 `<evidenceRoot>/sync/`）；给了就逐个判 present|absent。 */
  expectMarkers?: string[];
  authorization?: "sandbox" | "dev_instance";
}

export interface PlaytestMultiClientVerdict {
  id: string;
  dir: string;
  files: { exitCode: EvidenceState; state: EvidenceState; qa: EvidenceState };
  exitCode: number | null;
  green: boolean;
  reasons: string[];
  /** 进场/出场锚（跨轮引用证据必须带它；带不出按未验证处理）。 */
  anchor: {
    stateAt: string | null;
    planMtimeMs: number | null;
    lastRound: number | null;
    lastRoundOk: boolean | null;
  };
}

export interface PlaytestMultiResult {
  ok: boolean;
  code?: string;
  message?: string;
  clients?: PlaytestMultiClientVerdict[];
  /** 自动发现时**被跳过的**子目录（保留名 `sync`）。显式列出 ⇒ 跳过不是静默的。 */
  autoSkipped?: string[];
  markers?: { name: string; state: EvidenceState; path: string }[];
  joint?: {
    allGreen: boolean;
    greenCount: number;
    total: number;
    anchors: Record<string, PlaytestMultiClientVerdict["anchor"]>;
    mismatches: string[];
  };
}

const MAX_CLIENTS = 16;
/** 保留目录名：`<evidenceRoot>/sync/` 放会合 marker，**不是**客户端。 */
const RESERVED_SYNC_DIR = "sync";

function readTextSafe(p: string): { state: EvidenceState; text?: string; reason?: string } {
  if (!existsSync(p)) return { state: "absent" };
  try {
    if (!statSync(p).isFile()) return { state: "unreadable", reason: "不是文件" };
    return { state: "present", text: readFileSync(p, "utf8") };
  } catch (e) {
    return { state: "unreadable", reason: (e as Error).message };
  }
}

function authorize(q: PlaytestMultiQuery, dirs: string[]):
  | { ok: true; root: string }
  | { ok: false; code: string; message: string } {
  if (process.env.MC_SKILL_PLAYTEST_ALLOW !== "1") {
    return {
      ok: false,
      code: "PLAYTEST_DISABLED",
      message: "游玩自测未授权。设置 MC_SKILL_PLAYTEST_ALLOW=1 + MC_SKILL_PLAYTEST_ROOT=<绝对路径>（见根 AGENTS.md）。",
    };
  }
  const envRoot = (process.env.MC_SKILL_PLAYTEST_ROOT || "").trim();
  if (!envRoot || !isAbsolute(envRoot) || !existsSync(envRoot)) {
    return { ok: false, code: "AUTHORIZATION_REQUIRED", message: `MC_SKILL_PLAYTEST_ROOT 必须是存在的绝对路径：${envRoot || "(空)"}` };
  }
  const root = nativeReal(resolve(envRoot));
  // 逐目录 realpath 校验；**任一越界整体拒**（不逐客户端放行 —— 否则「一半在根内」会静默变成"部分可信"）
  for (const d of dirs) {
    const real = existsSync(d) ? nativeReal(resolve(d)) : resolve(d);
    if (!isInsideReal(real, root)) {
      return { ok: false, code: "OUTSIDE_AUTHORIZED_ROOT", message: `证据目录不在授权根内：${d} ⇒ realpath ${real}，root ${root}` };
    }
  }
  return { ok: true, root };
}

/** 从 state.json 文本里取 `"at": "..."`（不整体 JSON.parse —— 驱动是手拼 JSON，容错优先）。 */
function pickStateAt(text: string | undefined): string | null {
  if (!text) return null;
  const m = text.match(/"at"\s*:\s*"([^"]*)"/);
  return m ? m[1] : null;
}

/** 读 rounds.jsonl 最后一行，取轮号与 ok。 */
function lastRound(p: string): { round: number | null; ok: boolean | null } {
  const r = readTextSafe(p);
  if (r.state !== "present" || !r.text) return { round: null, ok: null };
  const lines = r.text.split(/\r?\n/).filter((l) => l.trim());
  const last = lines[lines.length - 1];
  if (!last) return { round: null, ok: null };
  const rn = last.match(/"round"\s*:\s*(\d+)/);
  const ok = last.match(/"ok"\s*:\s*(true|false)/);
  return { round: rn ? Number(rn[1]) : null, ok: ok ? ok[1] === "true" : null };
}

function inspectClient(c: PlaytestMultiClient): PlaytestMultiClientVerdict {
  const dir = resolve(c.evidenceDir);
  const id = (c.id || dir.split(/[\\/]/).filter(Boolean).pop() || dir).trim();
  const reasons: string[] = [];

  const exit = readTextSafe(join(dir, "exit-code.txt"));
  const state = readTextSafe(join(dir, "state.json"));

  // qa.log：约定是「证据目录内任意 .log 尾部」—— 这里取所有 .log 中修改时间最新的一个
  let qaPath: string | null = null;
  let qaMtime = -1;
  try {
    for (const f of readdirSync(dir)) {
      if (!f.toLowerCase().endsWith(".log")) continue;
      const full = join(dir, f);
      const st = statSync(full);
      if (st.isFile() && st.mtimeMs > qaMtime) {
        qaMtime = st.mtimeMs;
        qaPath = full;
      }
    }
  } catch {
    /* 目录不可读 ⇒ qa 判 absent/unreadable，下面按路径判 */
  }
  const qa: { state: EvidenceState } = qaPath ? readTextSafe(qaPath) : { state: "absent" };

  let exitCode: number | null = null;
  if (exit.state === "present" && exit.text !== undefined) {
    const n = Number(exit.text.trim());
    exitCode = Number.isFinite(n) ? n : null;
  }

  if (exit.state !== "present") reasons.push(`exit-code.txt=${exit.state}（缺件不得读成通过）`);
  else if (exitCode !== 0) reasons.push(`exit-code=${exit.text?.trim() ?? "?"}（非 0 或不可解析）`);
  if (state.state !== "present") reasons.push(`state.json=${state.state}`);
  if (qa.state !== "present") reasons.push(`qa.log(任意 .log)=${qa.state}`);

  const lr = lastRound(join(dir, "rounds.jsonl"));
  if (lr.ok === false) reasons.push(`rounds.jsonl 末轮 ok=false（round ${lr.round ?? "?"}）`);
  if (lr.round === null) reasons.push("rounds.jsonl 末轮读不到轮号（锚点缺失）");

  const planPath = join(dir, "plan.txt");
  let planMtimeMs: number | null = null;
  try {
    planMtimeMs = existsSync(planPath) ? statSync(planPath).mtimeMs : null;
  } catch {
    planMtimeMs = null;
  }

  return {
    id,
    dir,
    files: { exitCode: exit.state, state: state.state, qa: qa.state },
    exitCode,
    green: reasons.length === 0,
    reasons,
    anchor: { stateAt: pickStateAt(state.text), planMtimeMs, lastRound: lr.round, lastRoundOk: lr.ok },
  };
}

export function inspectPlaytestMulti(query: PlaytestMultiQuery): PlaytestMultiResult {
  // 收集客户端：显式 clients 优先；否则扫 evidenceRoot 的直接子目录
  let clients: PlaytestMultiClient[] = (query.clients ?? []).filter((c) => c && typeof c.evidenceDir === "string" && c.evidenceDir.trim());
  let evidenceRoot = (query.evidenceRoot || "").trim();
  const autoSkipped: string[] = [];

  if (!clients.length) {
    if (!evidenceRoot) {
      return { ok: false, code: "INVALID_INPUT", message: "须给 clients[]（显式列表）或 evidenceRoot（自动扫其直接子目录）。" };
    }
    if (!isAbsolute(evidenceRoot) || !existsSync(evidenceRoot)) {
      return { ok: false, code: "EVIDENCE_NOT_FOUND", message: `evidenceRoot 必须是存在的绝对路径：${evidenceRoot}` };
    }
    try {
      clients = readdirSync(evidenceRoot, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .filter((d) => {
          // 保留名：sync 是会合 marker 的家，不是客户端。**跳过要留痕**（autoSkipped），不做静默丢弃。
          if (d.name.toLowerCase() === RESERVED_SYNC_DIR) {
            autoSkipped.push(d.name);
            return false;
          }
          return true;
        })
        .map((d) => ({ id: d.name, evidenceDir: join(evidenceRoot, d.name) }));
    } catch (e) {
      return { ok: false, code: "EVIDENCE_UNREADABLE", message: `evidenceRoot 读不动：${(e as Error).message}` };
    }
  }

  if (!clients.length) {
    return { ok: false, code: "NO_CLIENTS", message: "一个客户端都没解析出来 ⇒ 没测，不判绿。" };
  }
  if (clients.length > MAX_CLIENTS) {
    return { ok: false, code: "TOO_MANY_CLIENTS", message: `客户端数 ${clients.length} 超过硬顶 ${MAX_CLIENTS}。` };
  }
  for (const c of clients) {
    if (!isAbsolute(resolve(c.evidenceDir))) {
      return { ok: false, code: "INVALID_INPUT", message: `证据目录必须是绝对路径：${c.evidenceDir}` };
    }
  }
  if (!evidenceRoot) {
    // 未给 evidenceRoot 时，以「共用的父目录」作为 marker 根（显式 clients 的公共父）
    const parents = clients.map((c) => resolve(c.evidenceDir).split(/[\\/]/).slice(0, -1).join("/"));
    evidenceRoot = parents[0] || "";
  }

  const auth = authorize(query, clients.map((c) => resolve(c.evidenceDir)));
  if (!auth.ok) return { ok: false, code: auth.code, message: auth.message };

  const verdicts = clients.map(inspectClient);
  const dup = verdicts.map((v) => v.id).filter((id, i, a) => a.indexOf(id) !== i);
  if (dup.length) {
    return { ok: false, code: "DUPLICATE_CLIENT_ID", message: `客户端 id 重复：${[...new Set(dup)].join(", ")}（id 是联合锚的键，必须唯一）` };
  }

  const markers = (query.expectMarkers ?? []).map((name) => {
    const p = join(evidenceRoot, "sync", name);
    return { name, state: readTextSafe(p).state as EvidenceState, path: p };
  });

  const allGreen = verdicts.every((v) => v.green);
  const missingMarkers = markers.filter((m) => m.state !== "present").map((m) => m.name);
  const mismatches: string[] = [];
  verdicts.filter((v) => !v.green).forEach((v) => mismatches.push(`${v.id}: ${v.reasons.join("; ")}`));
  if (missingMarkers.length) mismatches.push(`会合 marker 缺失: ${missingMarkers.join(", ")}（预期根 ${join(evidenceRoot, "sync")}）`);

  const ok = allGreen && missingMarkers.length === 0;
  return {
    ok,
    clients: verdicts,
    ...(autoSkipped.length ? { autoSkipped } : {}),
    markers: markers.length ? markers : undefined,
    joint: {
      allGreen,
      greenCount: verdicts.filter((v) => v.green).length,
      total: verdicts.length,
      anchors: Object.fromEntries(verdicts.map((v) => [v.id, v.anchor])),
      mismatches,
    },
    ...(ok
      ? {}
      : {
          code: allGreen ? "MARKERS_MISSING" : "CLIENT_NOT_GREEN",
          message: `联合判红：${mismatches.join(" | ") || "（无明细）"}`,
        }),
  };
}
