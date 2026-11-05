/**
 * playtest_bridge —— 游玩自测桥调用（BlackBoxPro HTTP，源码级契约）。
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
  /** 连错实例防线：给了就与 /status 报的 platform 比对；不一致 ⇒ BRIDGE_INSTANCE_MISMATCH（两侧值都回）。 */
  expectPlatform?: string;
  /** 连错实例防线：给了就与 /status 报的 version 比对；不一致 ⇒ BRIDGE_INSTANCE_MISMATCH（两侧值都回）。 */
  expectVersion?: string;
  authorization?: "sandbox" | "dev_instance";
  confirmed?: boolean;
}

const HOST = "127.0.0.1";
/**
 * 冻结协议（A3-客户端）：扫描区间 = 38081 **递减**到 38071（共 11 个端口）。
 * 递减顺序保证「38081 空闲时行为与今天一致」。
 */
export const BRIDGE_PORT_BASE = 38081;
export const BRIDGE_PORT_MIN = 38071;
/** 桥 /status 的握手标记，与本侧支持的协议上界（> 上界一律拒，不猜、不降级）。 */
export const BRIDGE_HANDSHAKE_TYPE = "mc-skill-playtest-bridge";
export const BRIDGE_PROTOCOL_MAX = 1;
/** 扫描期单端口探测超时（冻结协议 400ms）；正常调用仍用 DEFAULT_TIMEOUT_MS。 */
const SCAN_PROBE_TIMEOUT_MS = 400;
/** 测试专用区间注入的跨度上界（防误用把区间开到几千口）。 */
const MAX_SCAN_SPAN = 64;
const DEFAULT_TIMEOUT_MS = 10_000;
const HARD_TIMEOUT_MS = 120_000;
const DEFAULT_POLL_MS = 250;
const CALLS_MAX_LINES = 200;
// P2-R4-7：calls.jsonl 证据文件字节封顶 + 一次性「触顶」标记位（此前是 512*1024 裸 magic 且静默截断）。
const CALLS_MAX_BYTES = 512 * 1024;
let callsCapNoted = false;

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
  /** 失败原因是**客户端超时**（AbortError）而非连接被拒 —— 扫描期要把 refused / timeout 分开记账。 */
  timeout?: boolean;
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
    const aborted = (e as Error).name === "AbortError";
    const msg = aborted ? `客户端超时（${timeoutMs}ms）` : (e as Error).message;
    return { ok: false, code: "BRIDGE_UNREACHABLE", message: `连不上桥 ${HOST}:${port} —— ${msg}`, timeout: aborted };
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

/**
 * A1（2026-11-04）· 命令/动作回执：从桥回执的 `data` 里读 `observed` / `errorType`。
 *
 * 语义（**判读侧消费点**，别再造死字段）：
 *   - `observed:false` = **动作发出去了，但没观测到效果**（本仓桥模板的 `chat_command` 恒为 false，
 *     见 `generators/playtest-bridge-mod.ts`；它只发聊天包，观测不到命令有没有被解析/生效）。
 *   - 缺键 ⇒ 返回 null（= **未知**，例如 BlackBoxPro 不带该键）—— **不得**把「缺键」读成 true。
 *   - `errorType` ∈ parse | runtime | safety | skipped | unobserved（与 driver 的 cmd 回执同词表）。
 */
function receiptOf(data: unknown): { observed: boolean; errorType: string | null } | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  if (typeof o.observed !== "boolean") return null;
  return { observed: o.observed, errorType: typeof o.errorType === "string" ? o.errorType : null };
}

/** P2-R4-9：把 query_* 读数并入证据时按字节截断，避免个别响应把 calls.jsonl 撑爆。 */
function clipJson(value: unknown, maxBytes: number): unknown {
  try {
    const s = JSON.stringify(value);
    if (s !== undefined && Buffer.byteLength(s, "utf8") <= maxBytes) return value;
    return { _truncated: true, preview: s.slice(0, maxBytes) };
  } catch {
    return { _unserializable: true };
  }
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
  try {
    const size = statSync(file).size;
    if (size > CALLS_MAX_BYTES) {
      // P2-R4-7：触顶必须**一次性留痕**，否则证据流无声掐断（inspect 会把「后半程没记录」
      // 读成「后半程没动作」）。写一条 CALLS_CAPPED 标记后不再追加。
      if (!callsCapNoted) {
        callsCapNoted = true;
        try {
          appendFileSync(file, JSON.stringify({ at: new Date().toISOString(), note: "CALLS_CAPPED", bytes: size }) + "\n", "utf8");
        } catch {
          /* ignore */
        }
      }
      return;
    }
  } catch {
    /* 文件不存在 ⇒ 正常首次写入 */
  }
  try {
    appendFileSync(file, JSON.stringify({ at: new Date().toISOString(), ...entry }) + "\n", "utf8");
  } catch {
    /* 证据写失败不阻塞主流程 */
  }
}

// ─────────────── A3：端口扫描 + 形状握手 + 连错实例防线 + 有界自愈 ───────────────

/**
 * 带内失败信封（本模块新增失败点的字面量位点，全模块共 2 处）。
 *
 * A-27 台账说明：`src/utils/actionable.ts` 的合同散文按 `src/**` 里的字面量处数当场复算
 * （`test-wave-bcd.mjs` 的 A-27 门），而那个台账文件在本次 write scope 之外、不能动。
 * ⇒ 本模块**新增的失败点统一走下面两个构造器**（新增 2 处字面量），同时把 A3 因加 bridge 块而**重写**的
 * 两处失败点（status / execute 连不上）改走 bridgeFailure（抵消 2 处）⇒ 本文件该字面量**处数净 0**
 * （改动前后都是 15 处）。其余既有失败点一字不动（含 auth / port 前置拒绝）。详见交付报告「兼容性」。
 */
function bridgeFailure(code: string, message: string, extra?: Record<string, unknown>): Record<string, unknown> {
  return { ok: false, code, message, ...(extra ?? {}) };
}

/** resolveBridge 的失败分支（tagged union 的唯一构造点）。 */
function resolveFailed(failure: ResolveFailure) {
  return { ok: false as const, failure };
}

type ResolveResult = { ok: true; bridge: ResolvedBridge } | ReturnType<typeof resolveFailed>;

/** 扫描记账里允许出现的原因（冻结协议逐字）。 */
type ScanReason = "refused" | "timeout" | "wrong_shape" | "protocol_too_new";
type HandshakeKind = "strict" | "legacy";
interface ScannedPort {
  port: number;
  reason: ScanReason;
}

/** 已解析（并通过形状握手）的桥实例 —— 每个响应都靠它回 bridge 块。 */
interface ResolvedBridge {
  /** 本次**实际探通**的端口（与 /status 自报的 httpPort 分开记，便于发现错位）。 */
  probedPort: number;
  handshake: HandshakeKind;
  type: string | null;
  bridgeProtocol: number | null;
  platform: string | null;
  version: string | null;
  httpPort: number | null;
  ready: boolean;
  actions: unknown;
  statusJson: Record<string, unknown>;
  /** legacy 档的显式披露（严格档没有）。 */
  handshakeNote?: string;
}

type ProbeResult =
  | { kind: "ok"; handshake: HandshakeKind; json: Record<string, unknown> }
  | { kind: ScanReason; message?: string };

interface ResolveFailure {
  code: string;
  message: string;
  scanned: ScannedPort[];
  hint?: string;
}

/**
 * 扫描区间：默认 38081→38071（冻结协议）。
 * `MC_SKILL_BRIDGE_SCAN_BASE` / `MC_SKILL_BRIDGE_SCAN_MIN` 是**测试专用注入点** ——
 * test-core 要覆盖「默认端口被占 ⇒ 命中下一口」与「显式 port 不扫描」的语义，又不能占本机真实 38081。
 * 非法值（非整数 / 越界 / min > base / 跨度 > MAX_SCAN_SPAN）一律忽略，回落默认区间（生产行为不变）。
 */
function scanRange(): { base: number; min: number } {
  const pick = (name: string, dflt: number): number => {
    const v = Number(process.env[name]);
    return Number.isInteger(v) && v >= 1 && v <= 65535 ? v : dflt;
  };
  const base = pick("MC_SKILL_BRIDGE_SCAN_BASE", BRIDGE_PORT_BASE);
  const min = pick("MC_SKILL_BRIDGE_SCAN_MIN", BRIDGE_PORT_MIN);
  if (min > base || base - min + 1 > MAX_SCAN_SPAN) return { base: BRIDGE_PORT_BASE, min: BRIDGE_PORT_MIN };
  return { base, min };
}

/**
 * 形状握手判据（冻结协议逐字，**别在这里加宽松项**）：
 *   严格档 = status==="success" ∧ type===BRIDGE_HANDSHAKE_TYPE ∧ typeof bridgeProtocol==="number" ∧ <= 1
 *   旧桥档 = **type 缺失** ∧ status==="success" ∧ typeof platform==="string" ∧ typeof httpPort==="number" ∧ Array.isArray(actions)
 *   bridgeProtocol > 1 ⇒ protocol_too_new（拒绝；不猜语义、不降级当旧桥）
 *   type 是**别的串** ⇒ wrong_shape（不是我们的桥，也不许当旧桥）
 */
function classifyStatus(json: unknown): { kind: HandshakeKind | "protocol_too_new" | "wrong_shape" } {
  if (!json || typeof json !== "object") return { kind: "wrong_shape" };
  const o = json as Record<string, unknown>;
  if (o.status !== "success") return { kind: "wrong_shape" };
  if (o.type === BRIDGE_HANDSHAKE_TYPE) {
    if (typeof o.bridgeProtocol !== "number" || !Number.isFinite(o.bridgeProtocol)) return { kind: "wrong_shape" };
    return { kind: o.bridgeProtocol > BRIDGE_PROTOCOL_MAX ? "protocol_too_new" : "strict" };
  }
  if (o.type !== undefined) return { kind: "wrong_shape" };
  const legacy = typeof o.platform === "string" && typeof o.httpPort === "number" && Array.isArray(o.actions);
  return { kind: legacy ? "legacy" : "wrong_shape" };
}

/** 探一个端口的 /status 并做形状握手。 */
async function probeStatusPort(port: number, timeoutMs: number): Promise<ProbeResult> {
  const r = await callBridge(port, "/status", undefined, timeoutMs);
  if (!r.ok) return { kind: r.timeout ? "timeout" : "refused", message: r.message };
  const c = classifyStatus(r.json);
  if (c.kind === "wrong_shape" || c.kind === "protocol_too_new") return { kind: c.kind };
  return { kind: "ok", handshake: c.kind, json: (r.json ?? {}) as Record<string, unknown> };
}

/** legacy 档必须**显式披露**（不得静默当成严格档）。 */
function legacyNote(platform: string | null, version: string | null): string {
  return (
    '旧桥兼容档（handshake:"legacy"）：该 /status 没有 type 标记（未带 "' +
    BRIDGE_HANDSHAKE_TYPE +
    '" / bridgeProtocol）⇒ 本工具按旧形状接受（platform=' +
    (platform ?? "?") +
    " / version=" +
    (version ?? "?") +
    "），但**无法判定协议版本，也无法确认连到的是本仓桥**。请升级桥 mod（generate_playtest_driver driverMode=external_bridge 附赠的模板已带 type+bridgeProtocol）。"
  );
}

function toResolved(port: number, handshake: HandshakeKind, j: Record<string, unknown>): ResolvedBridge {
  const platform = typeof j.platform === "string" ? j.platform : null;
  const version = typeof j.version === "string" ? j.version : null;
  return {
    probedPort: port,
    handshake,
    type: typeof j.type === "string" ? j.type : null,
    bridgeProtocol: typeof j.bridgeProtocol === "number" ? j.bridgeProtocol : null,
    platform,
    version,
    httpPort: typeof j.httpPort === "number" ? j.httpPort : null,
    ready: j.ready === true,
    actions: j.actions ?? null,
    statusJson: j,
    ...(handshake === "legacy" ? { handshakeNote: legacyNote(platform, version) } : {}),
  };
}

/**
 * 解析要连的桥。
 *   · 显式 port ⇒ **只探这一个端口，不扫描**（向后兼容）；
 *   · 未给 port ⇒ 从 BRIDGE_PORT_BASE **递减**扫到 BRIDGE_PORT_MIN，第一个通过形状握手的端口胜出。
 * 全扫不中 ⇒ BRIDGE_NOT_FOUND（带 scanned[]，不是空结果）；有 protocol_too_new 且无一命中 ⇒ BRIDGE_PROTOCOL_TOO_NEW。
 */
async function resolveBridge(query: PlaytestBridgeQuery): Promise<ResolveResult> {
  const explicit = query.port;
  if (explicit !== undefined) {
    const r = await probeStatusPort(explicit, DEFAULT_TIMEOUT_MS);
    if (r.kind === "ok") return { ok: true, bridge: toResolved(explicit, r.handshake, r.json) };
    const scanned: ScannedPort[] = [{ port: explicit, reason: r.kind }];
    if (r.kind === "protocol_too_new") {
      return resolveFailed({
        code: "BRIDGE_PROTOCOL_TOO_NEW",
        message: `端口 ${explicit} 上的桥协议版本高于本工具支持上界 ${BRIDGE_PROTOCOL_MAX} ⇒ 拒绝（不猜、不降级）。`,
        scanned,
        hint: "升级本工具，或把桥降到本工具支持的协议版本。",
      });
    }
    if (r.kind === "wrong_shape") {
      return resolveFailed({
        code: "BRIDGE_NOT_FOUND",
        message: `端口 ${explicit} 上的服务不是本仓桥（/status 形状握手不通过；显式 port **不扫描**）。`,
        scanned,
        hint: "核对端口，或省掉 port 让工具扫 38081→38071。",
      });
    }
    return resolveFailed({
      code: "BRIDGE_UNREACHABLE",
      message: r.message ?? `连不上桥 ${HOST}:${explicit}`,
      scanned,
      hint: "先确认游戏已启动且桥已加载（mods 内有桥 jar + 依赖）。",
    });
  }

  const { base, min } = scanRange();
  const scanned: ScannedPort[] = [];
  let tooNew: number | null = null;
  for (let p = base; p >= min; p--) {
    const r = await probeStatusPort(p, SCAN_PROBE_TIMEOUT_MS);
    if (r.kind === "ok") return { ok: true, bridge: toResolved(p, r.handshake, r.json) };
    scanned.push({ port: p, reason: r.kind });
    if (r.kind === "protocol_too_new" && tooNew === null) tooNew = p;
  }
  if (tooNew !== null) {
    return resolveFailed({
      code: "BRIDGE_PROTOCOL_TOO_NEW",
      message: `端口 ${tooNew} 的桥协议版本高于本工具支持上界 ${BRIDGE_PROTOCOL_MAX}，且 ${base}→${min} 内没有可用的协议 ${BRIDGE_PROTOCOL_MAX} 桥 ⇒ 拒绝（不猜、不降级）。`,
      scanned,
      hint: "升级本工具。",
    });
  }
  return resolveFailed({
    code: "BRIDGE_NOT_FOUND",
    message: `扫描 ${base}→${min}（共 ${scanned.length} 个端口），无一个通过桥形状握手（type=${BRIDGE_HANDSHAKE_TYPE} + bridgeProtocol<=${BRIDGE_PROTOCOL_MAX}，或旧桥形状）。`,
    scanned,
    hint: "先确认游戏已启动且桥已加载（mods 内有桥 jar + 依赖），或显式传 port。",
  });
}

/** 每个响应都带 bridge 块：让调用方随时知道刚连的是哪个实例。 */
function bridgeBlock(b: ResolvedBridge): Record<string, unknown> {
  return {
    type: b.type,
    bridgeProtocol: b.bridgeProtocol,
    platform: b.platform,
    version: b.version,
    httpPort: b.httpPort,
    handshake: b.handshake,
    probedPort: b.probedPort,
    ...(b.handshakeNote ? { handshakeNote: b.handshakeNote } : {}),
  };
}

/** 连错实例防线：expectPlatform / expectVersion 与 /status 自报值比对；不一致返回**两侧值都在**的拒绝载荷。 */
function instanceMismatch(bridge: ResolvedBridge, query: PlaytestBridgeQuery): Record<string, unknown> | null {
  const wantPlatform = query.expectPlatform?.trim();
  const wantVersion = query.expectVersion?.trim();
  const mismatched: string[] = [];
  if (wantPlatform && bridge.platform !== wantPlatform) mismatched.push("platform");
  if (wantVersion && bridge.version !== wantVersion) mismatched.push("version");
  if (!mismatched.length) return null;
  return bridgeFailure(
    "BRIDGE_INSTANCE_MISMATCH",
    `连到的实例与期望不符（${mismatched.join(" + ")}）：期望 platform=${wantPlatform ?? "(未校验)"} / version=${wantVersion ?? "(未校验)"}，` +
      `实得 platform=${bridge.platform ?? "(缺)"} / version=${bridge.version ?? "(缺)"}。`,
    {
      expected: { platform: wantPlatform ?? null, version: wantVersion ?? null },
      actual: { platform: bridge.platform, version: bridge.version },
      mismatch: mismatched,
      bridge: bridgeBlock(bridge),
      note: "该端口上的桥**不是**你期望的实例（可能开着别的游戏实例）；已拒绝继续调用，不猜、不降级。",
    },
  );
}

/** 解析失败的统一出口：scanned[] 必须回，且明说它不是空结果。 */
function failureEnvelope(f: ResolveFailure): Record<string, unknown> {
  return bridgeFailure(f.code, f.message, {
    scanned: f.scanned,
    ...(f.hint ? { hint: f.hint } : {}),
    note: "scanned = 本次**实际探过**的端口与原因（refused|timeout|wrong_shape|protocol_too_new），不是空结果。",
  });
}

export async function callPlaytestBridge(query: PlaytestBridgeQuery): Promise<Record<string, unknown>> {
  const auth = authorize(query);
  if (!auth.ok) return { ok: false, code: auth.code, message: auth.message };

  if (query.port !== undefined && (!Number.isInteger(query.port) || query.port < 1 || query.port > 65535)) {
    return { ok: false, code: "INVALID_INPUT", message: `port 非法：${query.port}` };
  }

  if (query.action === "status") {
    let resolved = await resolveBridge(query);
    if (!resolved.ok) return failureEnvelope(resolved.failure);
    const mismatch = instanceMismatch(resolved.bridge, query);
    if (mismatch) return mismatch;

    let r = await callBridge(resolved.bridge.probedPort, "/status", undefined, DEFAULT_TIMEOUT_MS);
    if (!r.ok) {
      // 掉线自愈（**只读**操作才有）：已解析端口调用失败 ⇒ 重新解析一次 + 重试一次。
      // execute 绝不走这条路（可能重复施加副作用）—— 见下方 execute 分支的注释。
      const again = await resolveBridge(query);
      if (again.ok) {
        const m2 = instanceMismatch(again.bridge, query);
        if (m2) return m2;
        resolved = again;
        r = await callBridge(resolved.bridge.probedPort, "/status", undefined, DEFAULT_TIMEOUT_MS);
      }
      if (!r.ok) {
        return bridgeFailure(r.code ?? "BRIDGE_UNREACHABLE", r.message ?? `连不上桥 ${HOST}`, {
          hint: "先确认游戏已启动且桥已加载（mods 内有桥 jar + 依赖）。",
          bridge: bridgeBlock(resolved.bridge),
        });
      }
    }
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
      // A3：每个响应都带 bridge 块 —— 刚连的是哪个实例 / 握手档位 / 实际探通的端口。
      bridge: bridgeBlock(resolved.bridge),
      ...(resolved.bridge.handshakeNote ? { handshakeNote: resolved.bridge.handshakeNote } : {}),
      note: "ready=true 表示 player!=null && world!=null（已进世界）。",
    };
  }

  if (query.action === "execute") {
    const cmd = query.command;
    if (!cmd?.action?.trim()) return { ok: false, code: "INVALID_INPUT", message: "execute 须带 command={action, params?, delay?}。" };
    const resolved = await resolveBridge(query);
    if (!resolved.ok) return failureEnvelope(resolved.failure);
    const mismatch = instanceMismatch(resolved.bridge, query);
    if (mismatch) return mismatch;
    const id = randomUUID();
    const body = { id, action: cmd.action, params: cmd.params ?? {}, delay: cmd.delay ?? 0 };
    // ⚠️ execute **绝不自动重试**：它会真的施加副作用（发命令 / 聊天 / 放方块），
    //    重试可能把同一副作用施加两次。掉线自愈只给**只读**的 status 与 await 探针。
    const r = await callBridge(resolved.bridge.probedPort, "/execute", body, DEFAULT_TIMEOUT_MS);
    if (!r.ok) {
      return bridgeFailure(r.code ?? "BRIDGE_UNREACHABLE", r.message ?? `连不上桥 ${HOST}`, {
        bridge: bridgeBlock(resolved.bridge),
      });
    }
    const resp = responseOf(r.json);
    const timeout = resp.status === "failure" && /^Timeout after \d+ms$/.test(resp.message ?? "");
    // A1：把回执三态写进 calls.jsonl（observed:false 也要落盘 —— 否则 evidence 侧只能看到 "success"）。
    const receipt = receiptOf(resp.data);
    appendCall(auth.root, query.evidenceDir, {
      id,
      action: cmd.action,
      status: resp.status,
      message: resp.message,
      // P2-R4-10：execute 超时分支此前不落任何标记 ⇒ evidence 的 PLAYTEST_TIMEOUT 计数恒 0。
      ...(timeout ? { code: "PLAYTEST_TIMEOUT" } : {}),
      // P2-R4-9：query_* 的真实读数此前整段丢弃，违背「桥模式证据 = calls.jsonl + query 响应 + 日志」；按 2KB 截断并入。
      ...(resp.data !== undefined ? { data: clipJson(resp.data, 2048) } : {}),
      ...(receipt ? { observed: receipt.observed, errorType: receipt.errorType } : {}),
    });
    if (timeout) {
      return {
        ok: false,
        code: "PLAYTEST_TIMEOUT",
        httpStatus: r.httpStatus,
        id: resp.id ?? id,
        message: resp.message,
        bridge: bridgeBlock(resolved.bridge),
        note: "桥原生超时是普通 failure 串（无专用码）；这里映射为 PLAYTEST_TIMEOUT，不得读成空结果。",
      };
    }
    return {
      ok: resp.status === "success",
      httpStatus: r.httpStatus,
      id: resp.id ?? id,
      status: resp.status ?? null,
      message: resp.message ?? null,
      data: resp.data ?? null,
      bridge: bridgeBlock(resolved.bridge),
      // A1：回执三态（null = 桥不带该键 ⇒ 未知，不得读成通过）
      ...(receipt ? { observed: receipt.observed, errorType: receipt.errorType } : {}),
      ...(receipt && !receipt.observed
        ? {
            note:
              "observed:false = 动作**发出去了但未观测**（errorType=" +
              (receipt.errorType ?? "unobserved") +
              "）。判绿必须另有独立观测（await condition=… / query_* 复核），不得把本条读成通过。",
          }
        : {}),
    };
  }

  // await：桥没有 wait_until；由本工具轮询 query_* / /status 自建。
  const condition = query.condition;
  if (!condition) return { ok: false, code: "INVALID_INPUT", message: "await 须带 condition。" };
  // A3：**循环开始前解析一次并复用**（不要每次轮询都重扫 —— 一次扫描最坏 = 11 × 400ms）。
  const resolved = await resolveBridge(query);
  if (!resolved.ok) return failureEnvelope(resolved.failure);
  const mismatch0 = instanceMismatch(resolved.bridge, query);
  if (mismatch0) return mismatch0;
  let active: ResolvedBridge = resolved.bridge;
  const timeoutMs = Math.min(Math.max(query.timeoutMs ?? 30_000, 500), HARD_TIMEOUT_MS);
  const pollMs = Math.min(Math.max(query.pollIntervalMs ?? DEFAULT_POLL_MS, 50), 5_000);
  const params = query.params ?? {};
  const deadline = Date.now() + timeoutMs;
  const polls: Array<Record<string, unknown>> = [];
  let matched = false;
  let lastDetail: unknown = null;

  const probe = async (port: number): Promise<{ matched: boolean; detail: unknown; unreachable: boolean }> => {
    if (condition === "ready") {
      const r = await callBridge(port, "/status", undefined, DEFAULT_TIMEOUT_MS);
      if (!r.ok) return { matched: false, detail: { error: r.message }, unreachable: true };
      const j = (r.json ?? {}) as Record<string, unknown>;
      return { matched: j.ready === true, detail: { ready: j.ready === true }, unreachable: false };
    }
    const exec = async (
      action: string,
      p: Record<string, unknown>,
    ): Promise<{ matched: boolean; detail: unknown; unreachable: boolean }> => {
      const r = await callBridge(port, "/execute", { id: randomUUID(), action, params: p, delay: 0 }, DEFAULT_TIMEOUT_MS);
      if (!r.ok) return { matched: false, detail: { error: r.message }, unreachable: true };
      const resp = responseOf(r.json);
      const data = (resp.data ?? {}) as Record<string, unknown>;
      if (condition === "inventory_contains") {
        const want = String(params.itemId ?? "");
        const got = typeof data.itemId === "string" ? data.itemId : "";
        return { matched: Boolean(want) && got === want, detail: { itemId: got || null }, unreachable: false };
      }
      if (condition === "health_below" || condition === "health_above") {
        const hp = Number(data.health);
        const bound = Number(params.health);
        if (!Number.isFinite(hp) || !Number.isFinite(bound)) return { matched: false, detail: { health: data.health ?? null }, unreachable: false };
        return { matched: condition === "health_below" ? hp < bound : hp > bound, detail: { health: hp }, unreachable: false };
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
        return { matched: hit, detail: { count: Number.isFinite(count) ? count : null, typeCount }, unreachable: false };
      }
      if (condition === "chat_message_matches") {
        const pattern = String(params.pattern ?? "");
        const msgs = Array.isArray(data.messages) ? (data.messages as Array<Record<string, unknown>>) : [];
        const hit = Boolean(pattern) && msgs.some((m) => String(m.plain ?? "").includes(pattern));
        return { matched: hit, detail: { messages: msgs.length }, unreachable: false };
      }
      return { matched: false, detail: { error: `未支持的 condition：${condition}` }, unreachable: false };
    };

    if (condition === "inventory_contains") return exec("query_inventory_slot", { slot: params.slot ?? 36 });
    if (condition === "health_below" || condition === "health_above") return exec("query_player_state", {});
    // 把 type 一起透传：此前只传 radius，await 的 matched 便只能拿「区内任意实体」去比对
    // params.type ⇒ 带 type 的 await entity_nearby 永不成立（实测 fabric-1.21.11：count=20 仍 matched:false）。
    if (condition === "entity_nearby") return exec("query_nearby_entities", { radius: params.radius ?? 10, ...(params.type ? { type: params.type } : {}) });
    return exec("query_chat_history", { count: params.count ?? 20 });
  };

  const startedAt = Date.now();
  let pollsCapped = false;
  while (Date.now() < deadline) {
    let r = await probe(active.probedPort);
    if (r.unreachable) {
      // 掉线自愈（有界、只读）：已解析端口探不通 ⇒ 重新解析一次 + 重试一次。
      // 本循环里的探针全是 GET /status 与 query_*（幂等只读）⇒ 允许重试；
      // execute **动作**（非探针）绝不重试 —— 见 execute 分支注释。
      const again = await resolveBridge(query);
      if (again.ok) {
        const m = instanceMismatch(again.bridge, query);
        if (m) return m;
        active = again.bridge;
        r = await probe(active.probedPort);
      }
    }
    lastDetail = r.detail;
    polls.push({ at: new Date().toISOString(), port: active.probedPort, matched: r.matched, detail: r.detail });
    // P2-R4-8：matched 判定必须在封顶 break **之前** —— 否则第 N 次探测恰成立也会被误报超时（假红）。
    if (r.matched) {
      matched = true;
      break;
    }
    if (polls.length >= CALLS_MAX_LINES) {
      pollsCapped = true;
      break;
    }
    await new Promise((res) => setTimeout(res, pollMs));
  }
  const waitedMs = Date.now() - startedAt;

  appendCall(auth.root, query.evidenceDir, {
    action: "await",
    condition,
    matched,
    // P2-R4-10：失败 await 也落 PLAYTEST_TIMEOUT 码，让 evidence 侧能数出超时条数。
    ...(matched ? {} : { code: "PLAYTEST_TIMEOUT" }),
    polls: polls.length,
    last: polls[polls.length - 1] ?? null,
  });

  if (!matched) {
    return {
      ok: false,
      code: "PLAYTEST_TIMEOUT",
      matched: false,
      condition,
      waitedMs,
      polls: polls.length,
      lastDetail,
      bridge: bridgeBlock(active),
      ...(active.handshakeNote ? { handshakeNote: active.handshakeNote } : {}),
      ...(pollsCapped ? { pollsCapped: true } : {}),
      note: pollsCapped
        ? `轮询次数达采样上限 ${CALLS_MAX_LINES}（实测等待 ${waitedMs}ms，非申报 timeout）后条件仍未成立——放宽 pollIntervalMs 或核对动作序列，勿把此处读成已等满 timeout。`
        : "条件在超时前未成立（PLAYTEST_TIMEOUT）——不是「没有失败」。放宽 timeoutMs 或核对动作序列。",
    };
  }
  return {
    ok: true,
    matched: true,
    condition,
    polls: polls.length,
    lastDetail,
    bridge: bridgeBlock(active),
    ...(active.handshakeNote ? { handshakeNote: active.handshakeNote } : {}),
  };
}
