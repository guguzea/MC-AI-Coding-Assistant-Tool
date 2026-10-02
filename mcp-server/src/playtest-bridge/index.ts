/**
 * playtest_bridge —— 游玩自测桥调用（BlackBoxPro HTTP，源码级契约 as-of 2026-09-29）。
 *
 * 契约（读 dev-2.0 源码钉死）：
 *   POST /execute  CommandMessage{id,action,params,delay,target?} → ResponseMessage{id,status,message,data}；HTTP 恒 200
 *   GET  /status   {status,version,platform,httpPort,actions,ready}；ready = player!=null && world!=null
 *   超时：服务端 responseTimeoutMs 默认 10000ms ⇒ status:"failure" + "Timeout after Nms"（无专用码 ⇒ 本工具映射 PLAYTEST_TIMEOUT）
 * 安全（源码级）：桥**无鉴权**且 `InetSocketAddress(port)` 通配绑定 ⇒ 本工具硬编码只连 127.0.0.1；
 *   授权门（MC_SKILL_PLAYTEST_ALLOW/ROOT + realpath）做在本侧；不改系统代理/证书/防火墙。
 */
import { appendFileSync, existsSync, mkdirSync, statSync } from "fs";
import { isAbsolute, join, resolve } from "path";
import { randomUUID } from "crypto";
import { isInsideReal, nativeReal } from "../utils/project-sandbox.js";

export type BridgeAction = "status" | "execute" | "await";
export type AwaitCondition =
  | "ready"
  | "inventory_contains"
  | "health_below"
  | "health_above"
  | "entity_nearby"
  | "chat_message_matches";

export interface PlaytestBridgeQuery {
  action: BridgeAction;
  command?: { action: string; params?: Record<string, unknown>; delay?: number };
  condition?: AwaitCondition;
  params?: Record<string, unknown>;
  timeoutMs?: number;
  pollIntervalMs?: number;
  evidenceDir?: string;
  port?: number;
  authorization?: "sandbox" | "dev_instance";
  confirmed?: boolean;
}

const HOST = "127.0.0.1";
const DEFAULT_PORT = 38081;
const DEFAULT_TIMEOUT_MS = 10_000;
const HARD_TIMEOUT_MS = 120_000;
const DEFAULT_POLL_MS = 250;
const CALLS_MAX_LINES = 200;

type AuthResult = { ok: true; root: string } | { ok: false; code: string; message: string };

function authorize(query: PlaytestBridgeQuery): AuthResult {
  if (process.env.MC_SKILL_PLAYTEST_ALLOW !== "1") {
    return {
      ok: false,
      code: "PLAYTEST_DISABLED",
      message:
        "游玩自测未授权。设置 MC_SKILL_PLAYTEST_ALLOW=1 + MC_SKILL_PLAYTEST_ROOT=<绝对路径>（一次授权一路径，见根 AGENTS.md）。",
    };
  }
  const envRoot = (process.env.MC_SKILL_PLAYTEST_ROOT || "").trim();
  if (!envRoot || !isAbsolute(envRoot) || !existsSync(envRoot)) {
    return { ok: false, code: "AUTHORIZATION_REQUIRED", message: `MC_SKILL_PLAYTEST_ROOT 必须是存在的绝对路径：${envRoot || "(空)"}` };
  }
  if (query.action !== "status") {
    if (!query.authorization) {
      return { ok: false, code: "AUTHORIZATION_REQUIRED", message: 'execute / await 须带 authorization:"sandbox"|"dev_instance"。' };
    }
    if (query.confirmed !== true) {
      return { ok: false, code: "CONFIRMATION_REQUIRED", message: "execute / await 会真的操作游戏：须带 confirmed=true。" };
    }
  }
  return { ok: true, root: nativeReal(resolve(envRoot)) };
}

interface HttpResult {
  ok: boolean;
  httpStatus?: number;
  json?: unknown;
  code?: string;
  message?: string;
}

async function callBridge(port: number, path: string, body: unknown | undefined, timeoutMs: number): Promise<HttpResult> {
  const f = (globalThis as { fetch?: typeof fetch }).fetch;
  if (typeof f !== "function") return { ok: false, code: "BRIDGE_UNREACHABLE", message: "本 Node 运行时不带 fetch（需 Node >= 22）。" };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await f(`http://${HOST}:${port}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: ctrl.signal,
    });
    const text = await res.text();
    let json: unknown = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
    return { ok: true, httpStatus: res.status, json };
  } catch (e) {
    const msg = (e as Error).name === "AbortError" ? `客户端超时（${timeoutMs}ms）` : (e as Error).message;
    return { ok: false, code: "BRIDGE_UNREACHABLE", message: `连不上桥 ${HOST}:${port} —— ${msg}` };
  } finally {
    clearTimeout(timer);
  }
}

function responseOf(json: unknown): { status?: string; message?: string; data?: unknown; id?: string } {
  if (!json || typeof json !== "object") return {};
  const o = json as Record<string, unknown>;
  return {
    id: typeof o.id === "string" ? o.id : undefined,
    status: typeof o.status === "string" ? o.status : undefined,
    message: typeof o.message === "string" ? o.message : undefined,
    data: o.data,
  };
}

function appendCall(root: string, evidenceDir: string | undefined, entry: Record<string, unknown>): void {
  if (!evidenceDir?.trim()) return;
  const target = resolve(evidenceDir);
  const parent = target.endsWith(".jsonl") ? resolve(target, "..") : target;
  if (!existsSync(parent)) {
    // 只允许在授权根内创建证据目录
    const parentReal = (() => {
      try {
        return isInsideReal(nativeReal(resolve(parent, "..")), root);
      } catch {
        return false;
      }
    })();
    if (!parentReal) return;
    try {
      mkdirSync(parent, { recursive: true });
    } catch {
      return;
    }
  }
  let real: string;
  try {
    real = nativeReal(parent);
  } catch {
    return;
  }
  if (!isInsideReal(real, root)) return;
  const file = join(real, "calls.jsonl");
  const lines = (() => {
    try {
      return statSync(file).size > 0 ? 1 : 0;
    } catch {
      return 0;
    }
  })();
  if (lines > 0) {
    // 简化封顶：超大文件时截断重写代价高，这里只按文件字节数粗控。
    try {
      if (statSync(file).size > 512 * 1024) return;
    } catch {
      /* ignore */
    }
  }
  try {
    appendFileSync(file, JSON.stringify({ at: new Date().toISOString(), ...entry }) + "\n", "utf8");
  } catch {
    /* 证据写失败不阻塞主流程 */
  }
}

export async function callPlaytestBridge(query: PlaytestBridgeQuery): Promise<Record<string, unknown>> {
  const auth = authorize(query);
  if (!auth.ok) return { ok: false, code: auth.code, message: auth.message };

  const port = query.port ?? DEFAULT_PORT;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return { ok: false, code: "INVALID_INPUT", message: `port 非法：${query.port}` };
  }

  if (query.action === "status") {
    const r = await callBridge(port, "/status", undefined, DEFAULT_TIMEOUT_MS);
    if (!r.ok) return { ok: false, code: r.code, message: r.message, hint: "先确认游戏已启动且桥已加载（mods 内有桥 jar + 依赖）。" };
    const j = (r.json ?? {}) as Record<string, unknown>;
    return {
      ok: r.httpStatus === 200,
      httpStatus: r.httpStatus,
      status: j.status ?? null,
      version: j.version ?? null,
      platform: j.platform ?? null,
      httpPort: j.httpPort ?? null,
      actions: j.actions ?? null,
      ready: j.ready === true,
      note: "ready=true 表示 player!=null && world!=null（已进世界）。",
    };
  }

  if (query.action === "execute") {
    const cmd = query.command;
    if (!cmd?.action?.trim()) return { ok: false, code: "INVALID_INPUT", message: "execute 须带 command={action, params?, delay?}。" };
    const id = randomUUID();
    const body = { id, action: cmd.action, params: cmd.params ?? {}, delay: cmd.delay ?? 0 };
    const r = await callBridge(port, "/execute", body, DEFAULT_TIMEOUT_MS);
    if (!r.ok) return { ok: false, code: r.code, message: r.message };
    const resp = responseOf(r.json);
    appendCall(auth.root, query.evidenceDir, { id, action: cmd.action, status: resp.status, message: resp.message });
    const timeout = resp.status === "failure" && /^Timeout after \d+ms$/.test(resp.message ?? "");
    if (timeout) {
      return {
        ok: false,
        code: "PLAYTEST_TIMEOUT",
        httpStatus: r.httpStatus,
        id: resp.id ?? id,
        message: resp.message,
        note: "桥原生超时是普通 failure 串（无专用码）；这里映射为 PLAYTEST_TIMEOUT，不得读成空结果。",
      };
    }
    return { ok: resp.status === "success", httpStatus: r.httpStatus, id: resp.id ?? id, status: resp.status ?? null, message: resp.message ?? null, data: resp.data ?? null };
  }

  // await：桥没有 wait_until；由本工具轮询 query_* / /status 自建。
  const condition = query.condition;
  if (!condition) return { ok: false, code: "INVALID_INPUT", message: "await 须带 condition。" };
  const timeoutMs = Math.min(Math.max(query.timeoutMs ?? 30_000, 500), HARD_TIMEOUT_MS);
  const pollMs = Math.min(Math.max(query.pollIntervalMs ?? DEFAULT_POLL_MS, 50), 5_000);
  const params = query.params ?? {};
  const deadline = Date.now() + timeoutMs;
  const polls: Array<Record<string, unknown>> = [];
  let matched = false;
  let lastDetail: unknown = null;

  const probe = async (): Promise<{ matched: boolean; detail: unknown }> => {
    if (condition === "ready") {
      const r = await callBridge(port, "/status", undefined, DEFAULT_TIMEOUT_MS);
      if (!r.ok) return { matched: false, detail: { error: r.message } };
      const j = (r.json ?? {}) as Record<string, unknown>;
      return { matched: j.ready === true, detail: { ready: j.ready === true } };
    }
    const exec = async (action: string, p: Record<string, unknown>): Promise<{ matched: boolean; detail: unknown }> => {
      const r = await callBridge(port, "/execute", { id: randomUUID(), action, params: p, delay: 0 }, DEFAULT_TIMEOUT_MS);
      if (!r.ok) return { matched: false, detail: { error: r.message } };
      const resp = responseOf(r.json);
      const data = (resp.data ?? {}) as Record<string, unknown>;
      if (condition === "inventory_contains") {
        const want = String(params.itemId ?? "");
        const got = typeof data.itemId === "string" ? data.itemId : "";
        return { matched: Boolean(want) && got === want, detail: { itemId: got || null } };
      }
      if (condition === "health_below" || condition === "health_above") {
        const hp = Number(data.health);
        const bound = Number(params.health);
        if (!Number.isFinite(hp) || !Number.isFinite(bound)) return { matched: false, detail: { health: data.health ?? null } };
        return { matched: condition === "health_below" ? hp < bound : hp > bound, detail: { health: hp } };
      }
      if (condition === "entity_nearby") {
        const count = Number(data.count);
        const want = params.type ? String(params.type) : null;
        const list = Array.isArray(data.entities) ? (data.entities as Array<Record<string, unknown>>) : [];
        // 实体条目里 id 字段名按桥版本分叉：实测 BlackBoxPro 2.2.4 的 query_nearby_entities 用
        // entityId（fabric-1.21.1 的 `"blockId"` 同款风格），旧写法只认 `type` ⇒ 带 type 的 await
        // 永不成立（matched:false 而 count>0）。两个键都读，别只认一个。
        const idOf = (e: Record<string, unknown>) => String(e.type ?? e.entityId ?? e.id ?? "");
        const hit = want ? list.some((e) => idOf(e) === want) : Number.isFinite(count) && count > 0;
        const typeCount = want ? list.filter((e) => idOf(e) === want).length : null;
        return { matched: hit, detail: { count: Number.isFinite(count) ? count : null, typeCount } };
      }
      if (condition === "chat_message_matches") {
        const pattern = String(params.pattern ?? "");
        const msgs = Array.isArray(data.messages) ? (data.messages as Array<Record<string, unknown>>) : [];
        const hit = Boolean(pattern) && msgs.some((m) => String(m.plain ?? "").includes(pattern));
        return { matched: hit, detail: { messages: msgs.length } };
      }
      return { matched: false, detail: { error: `未支持的 condition：${condition}` } };
    };

    if (condition === "inventory_contains") return exec("query_inventory_slot", { slot: params.slot ?? 36 });
    if (condition === "health_below" || condition === "health_above") return exec("query_player_state", {});
    // 把 type 一起透传：此前只传 radius，await 的 matched 便只能拿「区内任意实体」去比对
    // params.type ⇒ 带 type 的 await entity_nearby 永不成立（实测 fabric-1.21.11：count=20 仍 matched:false）。
    if (condition === "entity_nearby") return exec("query_nearby_entities", { radius: params.radius ?? 10, ...(params.type ? { type: params.type } : {}) });
    return exec("query_chat_history", { count: params.count ?? 20 });
  };

  while (Date.now() < deadline) {
    const r = await probe();
    lastDetail = r.detail;
    polls.push({ at: new Date().toISOString(), matched: r.matched, detail: r.detail });
    if (polls.length >= CALLS_MAX_LINES) break;
    if (r.matched) {
      matched = true;
      break;
    }
    await new Promise((res) => setTimeout(res, pollMs));
  }

  appendCall(auth.root, query.evidenceDir, {
    action: "await",
    condition,
    matched,
    polls: polls.length,
    last: polls[polls.length - 1] ?? null,
  });

  if (!matched) {
    return {
      ok: false,
      code: "PLAYTEST_TIMEOUT",
      matched: false,
      condition,
      waitedMs: timeoutMs,
      polls: polls.length,
      lastDetail,
      note: "条件在超时前未成立（PLAYTEST_TIMEOUT）——不是「没有失败」。放宽 timeoutMs 或核对动作序列。",
    };
  }
  return { ok: true, matched: true, condition, polls: polls.length, lastDetail };
}
