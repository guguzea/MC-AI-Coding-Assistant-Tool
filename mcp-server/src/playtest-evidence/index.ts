/**
 * 游玩自测证据读取器（playtest evidence inspector）。
 *
 * 与 `runtime-inspect` 分离的理由：后者契约是「只 tail latest.log / crash-report + 固定相对目录 + 禁全盘」；
 * 本工具是**多件聚合**（exit-code / state.json / [QA] 段 / calls.jsonl / 截图）+ **授权 realpath 校验**，
 * 属两种信任面，不复用同一份禁令。日志面通过委派 `inspectRuntime()` 复用读数。
 *
 * 授权（三通道，见根 AGENTS.md「人在环例外：游玩自测」）：
 *   MC_SKILL_PLAYTEST_ALLOW=1 + MC_SKILL_PLAYTEST_ROOT=<绝对路径>；目标 realpath 必须落在根内。
 * 三态纪律：每件证据显式判 present | absent | unreadable —— 缺件/读不动**不得**塌成「没有失败」。
 */
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { isAbsolute, join, resolve } from "path";
import { inspectRuntime } from "../runtime-inspect/index.js";
import { isInsideReal, nativeReal } from "../utils/project-sandbox.js";

export type EvidenceState = "present" | "absent" | "unreadable";

export interface PlaytestEvidenceQuery {
  evidenceDir?: string;
  projectPath?: string;
  authorization?: "sandbox" | "dev_instance";
  runId?: string;
  maxEntries?: number;
  version?: string;
  logsDir?: string;
  crashReportsDir?: string;
  /** 截图根目录（默认 `<evidenceDir>/screenshots`）。桥模式下游戏截图落在 `<gameDir>/screenshots`，须显式传这里。 */
  screenshotsDir?: string;
}

const DEFAULT_MAX_ENTRIES = 50;
const HARD_MAX_ENTRIES = 500;
const SCREENSHOT_MAX = 200;

function capEntries(n?: number): number {
  const v = n ?? DEFAULT_MAX_ENTRIES;
  if (!Number.isFinite(v) || v < 1) return DEFAULT_MAX_ENTRIES;
  return Math.min(Math.floor(v), HARD_MAX_ENTRIES);
}

function readTextSafe(p: string): { state: EvidenceState; text?: string; reason?: string } {
  if (!existsSync(p)) return { state: "absent" };
  try {
    if (!statSync(p).isFile()) return { state: "unreadable", reason: "不是文件" };
    return { state: "present", text: readFileSync(p, "utf8") };
  } catch (e) {
    return { state: "unreadable", reason: (e as Error).message };
  }
}

function authorize(query: PlaytestEvidenceQuery):
  | { ok: true; root: string; dir: string }
  | { ok: false; code: string; message: string } {
  if (process.env.MC_SKILL_PLAYTEST_ALLOW !== "1") {
    return {
      ok: false,
      code: "PLAYTEST_DISABLED",
      message:
        "游玩自测未授权。设置 MC_SKILL_PLAYTEST_ALLOW=1 + MC_SKILL_PLAYTEST_ROOT=<绝对路径>（一次授权一路径，见根 AGENTS.md）。",
    };
  }
  const envRoot = (process.env.MC_SKILL_PLAYTEST_ROOT || "").trim();
  if (!envRoot) {
    return { ok: false, code: "AUTHORIZATION_REQUIRED", message: "缺 MC_SKILL_PLAYTEST_ROOT（绝对路径的授权根）。" };
  }
  if (!isAbsolute(envRoot) || !existsSync(envRoot)) {
    return { ok: false, code: "AUTHORIZATION_REQUIRED", message: `MC_SKILL_PLAYTEST_ROOT 必须是存在的绝对路径：${envRoot}` };
  }
  const root = nativeReal(resolve(envRoot));

  const base = query.evidenceDir?.trim()
    ? resolve(query.evidenceDir)
    : join(resolve(query.projectPath?.trim() || root), "playtest-evidence");
  const dir = query.runId?.trim() ? join(base, query.runId.trim()) : base;

  if (!existsSync(dir)) return { ok: false, code: "EVIDENCE_NOT_FOUND", message: `证据目录不存在：${dir}` };
  let real: string;
  try {
    real = nativeReal(dir);
  } catch (e) {
    return { ok: false, code: "EVIDENCE_NOT_FOUND", message: `无法解析证据目录真实路径：${(e as Error).message}` };
  }
  if (!isInsideReal(real, root)) {
    return {
      ok: false,
      code: "PATH_OUTSIDE_ALLOWLIST",
      message: `证据目录不在授权根内：${real}（root=${root}）。授权根是硬边界。`,
    };
  }
  return { ok: true, root, dir: real };
}

function collectScreenshots(shotDir: string, deadline: number): { count: number; newest: string[]; truncated: boolean } {
  if (!existsSync(shotDir)) return { count: 0, newest: [], truncated: false };
  const found: { path: string; mtime: number }[] = [];
  const walk = (d: string, depth: number) => {
    if (depth > 4 || Date.now() > deadline) return;
    let names: string[] = [];
    try {
      names = readdirSync(d);
    } catch {
      return;
    }
    for (const n of names) {
      if (found.length >= SCREENSHOT_MAX) return;
      const p = join(d, n);
      try {
        const st = statSync(p);
        if (st.isDirectory()) walk(p, depth + 1);
        else if (/\.png$/i.test(n)) found.push({ path: p.replace(/\\/g, "/"), mtime: st.mtimeMs });
      } catch {
        /* skip */
      }
    }
  };
  walk(shotDir, 0);
  found.sort((a, b) => b.mtime - a.mtime);
  const rel = (p: string) => p.slice(shotDir.replace(/\\/g, "/").length + 1);
  return { count: found.length, newest: found.slice(0, 5).map((f) => rel(f.path)), truncated: found.length >= SCREENSHOT_MAX };
}

export function inspectPlaytestEvidence(query: PlaytestEvidenceQuery): Record<string, unknown> {
  const auth = authorize(query);
  if (!auth.ok) return { ok: false, code: auth.code, message: auth.message };
  const maxEntries = capEntries(query.maxEntries);
  const deadline = Date.now() + 5000;
  const dir = auth.dir;
  const warnings: string[] = [];

  // exit-code.txt：GameTest 语义 = 退出码即「必需失败的测试数」；0 = 全绿。
  const exitRaw = readTextSafe(join(dir, "exit-code.txt"));
  let exitCode: Record<string, unknown> = { state: exitRaw.state };
  if (exitRaw.state === "present") {
    const n = Number((exitRaw.text ?? "").trim());
    if (!Number.isFinite(n)) exitCode = { state: "unreadable", reason: `非数字：${(exitRaw.text ?? "").trim().slice(0, 40)}` };
    else exitCode = { state: "present", value: n, failures: n, note: "GameTest 退出码语义：= 必需失败的测试数（0 = 全绿）" };
  } else if (exitRaw.reason) exitCode = { state: exitRaw.state, reason: exitRaw.reason };

  // state.json
  const stateRaw = readTextSafe(join(dir, "state.json"));
  let stateJson: Record<string, unknown> = { state: stateRaw.state };
  if (stateRaw.state === "present") {
    try {
      const parsed = JSON.parse(stateRaw.text ?? "") as Record<string, unknown>;
      stateJson = { state: "present", keys: Object.keys(parsed).sort(), data: parsed };
    } catch (e) {
      stateJson = { state: "unreadable", reason: (e as Error).message };
    }
  } else if (stateRaw.reason) stateJson = { state: stateRaw.state, reason: stateRaw.reason };

  // [QA] 段：证据目录内任意 .log 尾部
  const qa: Record<string, unknown> = { state: "absent" };
  try {
    const logs = readdirSync(dir).filter((n) => /\.log$/i.test(n));
    let done = 0;
    let error = 0;
    const hits: string[] = [];
    for (const n of logs.slice(0, 5)) {
      const r = readTextSafe(join(dir, n));
      if (r.state !== "present") continue;
      for (const line of (r.text ?? "").split(/\r?\n/)) {
        if (!line.includes("[QA]")) continue;
        if (line.includes("[QA] DONE")) done++;
        if (line.includes("[QA] ERROR")) {
          error++;
          if (hits.length < 5) hits.push(line.trim().slice(0, 160));
        }
      }
    }
    qa.state = logs.length === 0 ? "absent" : "present";
    if (qa.state === "present") Object.assign(qa, { logs: logs.slice(0, 5), done, error, errorLines: hits });
  } catch (e) {
    qa.state = "unreadable";
    qa.reason = (e as Error).message;
  }

  // calls.jsonl（桥模式调用轨迹）
  const callsPath = join(dir, "calls.jsonl");
  let calls: Record<string, unknown> = { state: "absent", path: callsPath.replace(/\\/g, "/") };
  if (existsSync(callsPath)) {
    const r = readTextSafe(callsPath);
    if (r.state !== "present") calls = { state: r.state, reason: r.reason };
    else {
      const lines = (r.text ?? "").split(/\r?\n/).filter(Boolean);
      const timeouts = lines.filter((l) => l.includes("PLAYTEST_TIMEOUT")).length;
      calls = {
        state: "present",
        lines: lines.length,
        shown: Math.min(lines.length, maxEntries),
        timeouts,
        last: lines.slice(-3).map((l) => l.slice(0, 200)),
      };
    }
  }

  // 截图根：默认 <evidenceDir>/screenshots；桥模式下真实截图在 <gameDir>/screenshots ⇒ 允许显式指定（仍须在授权根内）。
  let shotsRoot = join(dir, "screenshots");
  if (query.screenshotsDir?.trim()) {
    const cand = resolve(query.screenshotsDir.trim());
    if (existsSync(cand) && isInsideReal(nativeReal(cand), auth.root)) shotsRoot = cand;
    else warnings.push(`screenshotsDir 不可用（不存在或不在授权根内），已回退 <evidenceDir>/screenshots：${cand}`);
  }
  const shots = collectScreenshots(shotsRoot, deadline);
  if (shots.truncated) warnings.push(`截图超过 ${SCREENSHOT_MAX} 件，仅统计前 ${SCREENSHOT_MAX} 件`);

  // 日志面委派（可选）
  let runtime: unknown;
  if (query.logsDir || query.crashReportsDir) {
    try {
      runtime = inspectRuntime({
        logsDir: query.logsDir,
        crashReportsDir: query.crashReportsDir,
        maxLines: 120,
        version: query.version,
      });
    } catch (e) {
      runtime = { ok: false, message: (e as Error).message };
    }
  }

  const failures = typeof (exitCode as { failures?: unknown }).failures === "number" ? (exitCode as { failures: number }).failures : null;
  const qaError = typeof qa.error === "number" ? qa.error : null;

  return {
    ok: true,
    root: auth.root,
    evidenceDir: dir,
    artifacts: {
      exitCode,
      stateJson,
      qa,
      calls,
      screenshots: { state: shots.count > 0 ? "present" : "absent", count: shots.count, newest: shots.newest },
    },
    failures: {
      fromExitCode: failures,
      fromQa: qaError,
      fromCallsTimeouts: typeof calls.timeouts === "number" ? calls.timeouts : null,
      note: "三个口径分别给出，不合并；null = 该件 absent/unreadable —— 不得读成 0。",
    },
    runtime,
    warnings,
    nextSteps: [
      "exitCode.absent/unreadable ⇒ 先确认 GameTest 或桥调用确实跑过（不是「没有失败」）",
      "calls.timeouts > 0 ⇒ 有 await/execute 超时（PLAYTEST_TIMEOUT），逐条看 calls.last",
      "桥模式判读用两遍法；跨查询非原子 ⇒ 只认条件成立",
    ],
  };
}
