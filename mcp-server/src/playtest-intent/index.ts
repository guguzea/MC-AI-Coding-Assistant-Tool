/**
 * playtest_intent —— in_jvm_player_agent 的 LLM 接线面（2026-10-01 用户裁定 3A：新增工具，不复用桥）。
 *
 * 一个工具两个动作：
 *   action=read  → 读观测面：`<evidenceDir>/state.json`（intentState / intents[] / lastIntent / scan.nearest / goto.arrived）、
 *                  菜单（`intent-menu.json`）、邮箱状态（`intent.json` 在否 / `intent.done.json` 最近一条）。
 *   action=write → 写意图：把扁平的 `{intent, ...params}` JSON 落到 `<evidenceDir>/intent.json`（driver 的 waitintent 步消费）。
 *                  **写前校验（fail-closed，与 driver 侧同一份菜单）**：意图名在菜单里 ∧ 不在禁列 ∧
 *                  参数 ⊆ 该意图声明的键 ∧ 必填参数齐 ∧ 不覆盖未消费的旧 intent.json（除非 overwrite=true）。
 *
 * 授权同 inspect_playtest_evidence（三通道）：`MC_SKILL_PLAYTEST_ALLOW=1` + `MC_SKILL_PLAYTEST_ROOT=<绝对路径>`，
 * 目标 realpath 必须落在授权根内。**不装桥、不跑游戏、不碰正式实例**。
 */
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "fs";
import { isAbsolute, join, resolve } from "path";
import { isInsideReal, nativeReal } from "../utils/project-sandbox.js";

export interface PlaytestIntentQuery {
  action: "read" | "write";
  evidenceDir: string;
  menuPath?: string;
  intent?: string;
  /** 参数（扁平键值）。CLI 侧经 `--params={"x":1}` 传的是字符串 ⇒ 这里也收 JSON 字符串并解析。 */
  params?: Record<string, string | number | boolean> | string;
  overwrite?: boolean;
  confirmed?: boolean;
  authorization?: "sandbox" | "dev_instance";
}

export interface PlaytestIntentResult {
  ok: boolean;
  action: string;
  code?: string;
  message?: string;
  evidenceDir?: string;
  menu?: { path: string; state: "present" | "absent" | "unreadable"; capabilityProfile?: string; intents?: string[]; forbidden?: string[] };
  state?: { path: string; state: "present" | "absent" | "unreadable"; body?: unknown };
  mailbox?: { request: string; requestState: "present" | "absent"; consumed: string; lastConsumed?: unknown };
  written?: unknown;
  availableIntents?: string[];
  allowedParams?: string[];
  /** 失败回灌（交接验收 §4.3-4）：lastIntent.ok===false 时 = 该意图菜单里的 fallback（换意图候选）；否则缺席。 */
  nextSteps?: string[];
}

interface MenuIntent {
  name: string;
  params?: Array<{ name: string; required?: boolean }>;
  fallback?: string[];
}

function readJsonSafe(p: string): { state: "present" | "absent" | "unreadable"; body?: unknown; reason?: string } {
  if (!existsSync(p)) return { state: "absent" };
  try {
    if (!statSync(p).isFile()) return { state: "unreadable", reason: "不是文件" };
    return { state: "present", body: JSON.parse(readFileSync(p, "utf8")) };
  } catch (e) {
    return { state: "unreadable", reason: (e as Error).message };
  }
}

function authorize(query: PlaytestIntentQuery):
  | { ok: true; root: string; dir: string }
  | { ok: false; code: string; message: string } {
  if (process.env.MC_SKILL_PLAYTEST_ALLOW !== "1") {
    return {
      ok: false,
      code: "PLAYTEST_DISABLED",
      message: "游玩自测未授权。设 MC_SKILL_PLAYTEST_ALLOW=1 + MC_SKILL_PLAYTEST_ROOT=<绝对路径>（一次授权一路径，见根 AGENTS.md）。",
    };
  }
  const envRoot = (process.env.MC_SKILL_PLAYTEST_ROOT || "").trim();
  if (!envRoot) return { ok: false, code: "AUTHORIZATION_REQUIRED", message: "缺 MC_SKILL_PLAYTEST_ROOT（绝对路径的授权根）。" };
  if (!isAbsolute(envRoot) || !existsSync(envRoot)) {
    return { ok: false, code: "AUTHORIZATION_REQUIRED", message: `MC_SKILL_PLAYTEST_ROOT 必须是存在的绝对路径：${envRoot}` };
  }
  const root = nativeReal(resolve(envRoot));
  const dirArg = (query.evidenceDir || "").trim();
  if (!dirArg || !isAbsolute(dirArg)) {
    return { ok: false, code: "INVALID_INPUT", message: "evidenceDir 必填且必须是绝对路径（证据目录，须在授权根内）。" };
  }
  const dir = resolve(dirArg);
  // write 允许目录尚不存在（首写建目录）；read / 校验一律要求目录已在
  const probe = existsSync(dir) ? nativeReal(dir) : nativeReal(resolve(dir, ".."));
  if (!isInsideReal(probe, root)) {
    return {
      ok: false,
      code: "PATH_OUTSIDE_ALLOWLIST",
      message: `证据目录不在授权根内：${dir}（root=${root}）。授权根是硬边界。`,
    };
  }
  return { ok: true, root, dir };
}

/** 菜单候选位（driver 产物落工程 playtest/；E2E 也可以直接放证据目录）。 */
function menuCandidates(dir: string, menuPath?: string): string[] {
  const out: string[] = [];
  if (menuPath?.trim()) out.push(resolve(menuPath));
  out.push(join(dir, "intent-menu.json"), join(dir, "..", "playtest", "intent-menu.json"), join(dir, "..", "playtest-files-intent-menu.json"));
  return out;
}

export function playtestIntent(query: PlaytestIntentQuery): PlaytestIntentResult {
  const auth = authorize(query);
  if (!auth.ok) return { ok: false, action: query.action, code: auth.code, message: auth.message };
  const dir = auth.dir;
  const requestPath = join(dir, "intent.json");
  const consumedPath = join(dir, "intent.done.json");
  const statePath = join(dir, "state.json");

  let menuFile = "";
  for (const c of menuCandidates(dir, query.menuPath)) {
    if (existsSync(c)) {
      menuFile = c;
      break;
    }
  }
  const menuRead = menuFile ? readJsonSafe(menuFile) : { state: "absent" as const };
  const menuBody = (menuRead.state === "present" ? (menuRead.body as Record<string, unknown>) : undefined) ?? undefined;
  const menuIntents: MenuIntent[] = Array.isArray(menuBody?.intents) ? (menuBody!.intents as MenuIntent[]) : [];
  const menu: PlaytestIntentResult["menu"] = {
    path: menuFile || menuCandidates(dir, query.menuPath)[0],
    state: menuRead.state,
    capabilityProfile: typeof menuBody?.capabilityProfile === "string" ? (menuBody.capabilityProfile as string) : undefined,
    intents: menuIntents.map((i) => i.name),
    forbidden: Array.isArray(menuBody?.forbidden) ? (menuBody!.forbidden as string[]) : undefined,
  };

  const stateRead = readJsonSafe(statePath);
  const consumedRead = readJsonSafe(consumedPath);
  // 失败回灌：driver 刚跑完的那条意图若判红（state.json 的 lastIntent.ok===false），把菜单里该意图的
  // fallback 列成 nextSteps（交接验收 §4.3-4「选错→判红→换意图→成功」的「给出可换的下一个意图」）。
  // 意图不在菜单（理论不可达，防御）/ 菜单没写 fallback 时退化为整份可用意图列表。
  const lastIntentBody =
    stateRead.state === "present"
      ? (stateRead.body as { lastIntent?: { name?: string; ok?: boolean } } | undefined)?.lastIntent
      : undefined;
  const nextSteps: string[] = [];
  if (lastIntentBody && lastIntentBody.ok === false) {
    const failedSpec = menuIntents.find((i) => i.name === lastIntentBody.name);
    const fb = (failedSpec?.fallback ?? []).filter((x) => typeof x === "string" && x.trim() !== "");
    if (fb.length) nextSteps.push(...fb);
    else nextSteps.push(...(menu.intents ?? []));
  }
  const base = {
    ok: true,
    action: query.action,
    evidenceDir: dir,
    menu,
    state: { path: statePath, state: stateRead.state, body: stateRead.body, reason: stateRead.reason } as PlaytestIntentResult["state"],
    mailbox: {
      request: requestPath,
      requestState: existsSync(requestPath) ? ("present" as const) : ("absent" as const),
      consumed: consumedPath,
      lastConsumed: consumedRead.state === "present" ? consumedRead.body : undefined,
    },
    ...(nextSteps.length ? { nextSteps } : {}),
  };

  if (query.action === "read") {
    return base;
  }

  // ── write ──────────────────────────────────────────────────────────────
  if (query.confirmed !== true) {
    return { ...base, ok: false, code: "CONFIRMATION_REQUIRED", message: "写意图需 confirmed=true（显式确认，避免误写邮箱）。" };
  }
  const name = (query.intent || "").trim();
  if (!name) return { ...base, ok: false, code: "INVALID_INPUT", message: "intent 必填（意图名）。" };
  if (menuRead.state === "absent") {
    return {
      ...base,
      ok: false,
      code: "MENU_NOT_FOUND",
      message: `没找到意图菜单（候选：${menuCandidates(dir, query.menuPath).join(" | ")}）——菜单是封闭真源，缺菜单拒绝写（fail-closed）。`,
    };
  }
  if (menuRead.state === "unreadable") {
    return { ...base, ok: false, code: "MENU_UNREADABLE", message: `菜单读不动（${menuFile}）：${menuRead.reason}` };
  }
  const forbidden = new Set(menu.forbidden ?? ["kill", "tnt", "fill"]);
  if (forbidden.has(name)) {
    return { ...base, ok: false, code: "INTENT_FORBIDDEN", message: `意图 ${name} 在禁列（${[...forbidden].join(", ")}）。` };
  }
  const spec = menuIntents.find((i) => i.name === name);
  if (!spec) {
    return {
      ...base,
      ok: false,
      code: "INTENT_NOT_IN_MENU",
      message: `意图 ${name} 不在菜单（拼错 / 未核实 / 不被当前 capabilityProfile 允许）。`,
      availableIntents: menu.intents,
    };
  }
  const declared = new Set((spec.params ?? []).map((p) => p.name));
  let paramsObj: Record<string, string | number | boolean>;
  if (typeof query.params === "string") {
    try {
      const parsed = JSON.parse(query.params);
      if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
        return { ...base, ok: false, code: "INVALID_INPUT", message: "params 字符串必须是 JSON 对象，如 {\"x\":10,\"z\":-20}。" };
      }
      paramsObj = parsed as Record<string, string | number | boolean>;
    } catch (e) {
      return { ...base, ok: false, code: "INVALID_INPUT", message: `params 不是合法 JSON：${(e as Error).message}` };
    }
  } else {
    paramsObj = query.params ?? {};
  }
  const given = Object.entries(paramsObj);
  const unknown = given.map(([k]) => k).filter((k) => !declared.has(k));
  if (unknown.length) {
    return {
      ...base,
      ok: false,
      code: "PARAM_NOT_DECLARED",
      message: `参数 ${unknown.join(", ")} 不在意图 ${name} 的声明里（白名单外拒绝写）。`,
      allowedParams: [...declared],
    };
  }
  const required = (spec.params ?? []).filter((p) => p.required).map((p) => p.name);
  const missing = required.filter((r) => !given.some(([k, v]) => k === r && String(v).trim() !== ""));
  if (missing.length) {
    return { ...base, ok: false, code: "MISSING_REQUIRED_PARAM", message: `意图 ${name} 缺必填参数：${missing.join(", ")}。`, allowedParams: [...declared] };
  }
  if (existsSync(requestPath) && query.overwrite !== true) {
    return {
      ...base,
      ok: false,
      code: "MAILBOX_BUSY",
      message: `邮箱里还有未被消费的 intent.json（driver 未取走或未在 waitintent 上）。要覆盖请显式 overwrite=true。`,
    };
  }
  const payload: Record<string, string | number | boolean> = { intent: name };
  for (const [k, v] of given) payload[k] = v;
  try {
    mkdirSync(dir, { recursive: true });
    const tmp = `${requestPath}.tmp`;
    writeFileSync(tmp, JSON.stringify(payload) + "\n", "utf8");
    renameSync(tmp, requestPath);
  } catch (e) {
    return { ...base, ok: false, code: "WRITE_FAILED", message: `写 ${requestPath} 失败：${(e as Error).message}` };
  }
  return { ...base, written: payload, message: `已写入 ${requestPath}（driver 的 waitintent 步会消费并改名 intent.done.json）。` };
}
