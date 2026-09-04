/**
 * JVM 工具链检测与子进程编排（T2）。
 *
 * 设计要点：
 * - 惰性：首次调用才执行 `java -version`，结果进程内缓存；绝不阻塞启动。
 * - 诚实：Java 缺失 / <17 → ready=false + reason，调用方返回 actionable(TOOLCHAIN_MISSING)，
 *   永不抛错崩溃 MCP 进程。
 * - VineFlower（1.9+ 需 Java 17）与 tiny-remapper 均为 Java 17+ 工具。
 */

import { spawn } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { actionable, type ActionEnvelope } from "../../utils/actionable.js";

export interface JavaProbe {
  /** java 可用 且 major >= 17 */
  ready: boolean;
  major: number | null;
  versionText: string | null;
  /** 实际调用的 java 路径（PATH 解析时为 "java"） */
  javaPath: string | null;
  reason?: "OK" | "TOO_OLD" | "NOT_FOUND";
}

const MIN_JAVA_MAJOR = 17;
const NEGATIVE_PROBE_TTL_MS = 45_000;
const STDOUT_CAP = 2 * 1024 * 1024;

let cachedProbe: JavaProbe | null = null;
let cachedProbeAt = 0;

function javaHomeCandidate(): string | null {
  const javaHome = process.env.JAVA_HOME;
  if (!javaHome) return null;
  const candidate = join(javaHome, "bin", process.platform === "win32" ? "java.exe" : "java");
  return existsSync(candidate) ? candidate : null;
}

export function pickJavaProbe(home: JavaProbe | null, pathProbe: JavaProbe): JavaProbe {
  const ready = [home, pathProbe].filter((p): p is JavaProbe => Boolean(p?.ready));
  if (ready.length) return ready.sort((a, b) => (b.major ?? 0) - (a.major ?? 0))[0];
  if (pathProbe.reason !== "NOT_FOUND") return pathProbe;
  return home ?? pathProbe;
}

function capStdio(acc: string, chunk: string): { text: string; truncated: boolean } {
  if (acc.length >= STDOUT_CAP) return { text: acc, truncated: true };
  const next = acc + chunk;
  if (next.length > STDOUT_CAP) return { text: next.slice(0, STDOUT_CAP), truncated: true };
  return { text: next, truncated: false };
}

/** 解析 `java -version` 整段输出 → major。优先 openjdk/java version 行；认裸 "23"。 */
export function parseJavaMajor(text: string): number | null {
  return parseJavaVersionOutput(text)?.major ?? null;
}

export function parseJavaVersionOutput(text: string): { major: number; versionText: string } | null {
  const lines = text.split(/\r?\n/);
  const preferred = lines.filter((l) => /(?:openjdk|java)\s+version\s+"/i.test(l));
  const search = preferred.length > 0 ? preferred : lines;
  for (const line of search) {
    const m = /version\s+"([^"]+)"/.exec(line);
    if (!m) continue;
    const ver = m[1];
    const oldStyle = /^1\.(\d+)(?:[._-]|$)/.exec(ver);
    if (oldStyle) return { major: Number(oldStyle[1]), versionText: line.trim() };
    const newStyle = /^(\d+)(?:[.\-"]|$)/.exec(ver);
    if (newStyle) return { major: Number(newStyle[1]), versionText: line.trim() };
  }
  const bare = /^\s*(\d+)\s*$/.exec(text.trim());
  if (bare) return { major: Number(bare[1]), versionText: text.trim() };
  return null;
}

function resolveJavaPath(): string | null {
  return javaHomeCandidate() ?? "java";
}

async function probeOne(javaPath: string): Promise<JavaProbe> {
  try {
    const { stdout, stderr } = await runJavaVersion(javaPath);
    const all = `${stdout}\n${stderr}`;
    const parsed = parseJavaVersionOutput(all);
    if (parsed === null) {
      return {
        ready: false,
        major: null,
        versionText: all.split("\n").find((l) => l.trim())?.trim() || null,
        javaPath,
        reason: "NOT_FOUND",
      };
    }
    if (parsed.major < MIN_JAVA_MAJOR) {
      return {
        ready: false,
        major: parsed.major,
        versionText: parsed.versionText,
        javaPath,
        reason: "TOO_OLD",
      };
    }
    return { ready: true, major: parsed.major, versionText: parsed.versionText, javaPath, reason: "OK" };
  } catch {
    return { ready: false, major: null, versionText: null, javaPath, reason: "NOT_FOUND" };
  }
}

/** 惰性探测 Java（force=true 时重跑）。只缓存 ready:true；否定结果 TTL 45s。永不抛出。 */
export async function probeJava(force = false): Promise<JavaProbe> {
  const now = Date.now();
  if (cachedProbe && !force) {
    if (cachedProbe.ready) return cachedProbe;
    if (now - cachedProbeAt < NEGATIVE_PROBE_TTL_MS) return cachedProbe;
  }
  const homePath = javaHomeCandidate();
  const homeProbe = homePath ? await probeOne(homePath) : null;
  const pathProbe = await probeOne("java");
  const probe = pickJavaProbe(homeProbe, pathProbe);
  cachedProbe = probe;
  cachedProbeAt = now;
  return probe;
}

async function runJavaVersion(javaPath: string, timeoutMs = 15_000): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(javaPath, ["-version"], {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("java -version 超时"));
    }, timeoutMs);
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr });
    });
  });
}

/** Java 工具链缺失的可操作指引（Adoptium 安装链接） */
export function toolchainActionable(detail?: string): ActionEnvelope {
  return actionable(
    "TOOLCHAIN_MISSING",
    detail ??
      "反编译工具需要 Java 17+ 运行时（VineFlower 与 tiny-remapper 均为 Java 17+ 工具），当前未检测到可用的 Java 17+。",
    [
      "安装 Java 17+（Temurin/Adoptium）：https://adoptium.net/temurin/releases/?version=17",
      "安装后重启 MCP Server（或确保 java 在 PATH / JAVA_HOME 指向 JDK 17+）",
      "无需 Java 的场景（analyze_mod_jar / search_mod_code）不受影响",
    ],
    ["analyze_mod_jar", "search_mod_code"],
  );
}

/** MC_SKILL_SKIP_DOWNLOAD=1 时 CI 等环境禁止一切下载 */
export function skipDownloadsEnabled(): boolean {
  return process.env.MC_SKILL_SKIP_DOWNLOAD === "1";
}

/** 下载被禁用的可操作指引 */
export function downloadDisabledActionable(detail: string): ActionEnvelope {
  return actionable(
    "DOWNLOAD_DISABLED",
    `已设置 MC_SKILL_SKIP_DOWNLOAD=1，跳过下载：${detail}`,
    [
      "这是 CI/离线环境的预期行为（诚实失败，不假装成功）",
      "需要真实下载时取消 MC_SKILL_SKIP_DOWNLOAD 环境变量后重试",
    ],
  );
}

/** runJava 内置兜底超时（15min）；调用点可传更贴合自身场景的值，仍可被 env 顶掉 */
export const DEFAULT_JAVA_TIMEOUT_MS = 15 * 60_000;

/**
 * 解析 Java 子进程超时（D-2b）。优先级：
 * 1. `MC_SKILL_JAVA_TIMEOUT_MS` —— override 语义必须最高，否则调用点写死的值（如 VineFlower
 *    的 15min）在无网/大 jar 场景依旧无从放宽，正是本条被记为 PARTIAL 的未修半边。
 * 2. 调用点显式传入的 `fallbackMs`。
 * 3. `DEFAULT_JAVA_TIMEOUT_MS`。
 *
 * 非法值（非数字 / NaN / <=0）**一律忽略并继续下沉**：一个拼错的 `MC_SKILL_JAVA_TIMEOUT_MS=abc`
 * 或 `=0` 绝不能变成「超时 0ms」而把刚起的 java 立刻 kill 掉。
 */
export function resolveJavaTimeoutMs(fallbackMs?: number): number {
  const raw = (process.env.MC_SKILL_JAVA_TIMEOUT_MS ?? "").trim();
  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return n;
  }
  if (typeof fallbackMs === "number" && Number.isFinite(fallbackMs) && fallbackMs > 0) return fallbackMs;
  return DEFAULT_JAVA_TIMEOUT_MS;
}

export interface JavaRunResult {
  code: number | null;
  stdout: string;
  stderr: string;
  truncated?: boolean;
}

/** 运行 Java 子进程（已探测过的 javaPath；超时/信号 → code=null + stderr 说明） */
export async function runJava(
  args: string[],
  opts: { javaPath?: string | null; timeoutMs?: number; cwd?: string; env?: NodeJS.ProcessEnv } = {},
): Promise<JavaRunResult> {
  const javaPath = opts.javaPath ?? (await probeJava()).javaPath ?? "java";
  const timeoutMs = resolveJavaTimeoutMs(opts.timeoutMs);
  return new Promise((resolve) => {
    const child = spawn(javaPath, args, {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
      cwd: opts.cwd,
      env: opts.env ? { ...process.env, ...opts.env } : process.env,
    });
    let stdout = "";
    let stderr = "";
    let truncated = false;
    child.stdout.on("data", (d) => {
      const next = capStdio(stdout, d.toString());
      stdout = next.text;
      if (next.truncated) truncated = true;
    });
    child.stderr.on("data", (d) => {
      const next = capStdio(stderr, d.toString());
      stderr = next.text;
      if (next.truncated) truncated = true;
    });
    const timer = setTimeout(() => {
      if (process.platform === "win32" && child.pid) {
        spawn("taskkill", ["/T", "/F", "/PID", String(child.pid)], { windowsHide: true, stdio: "ignore" });
      } else {
        child.kill();
      }
      resolve({ code: null, stdout, stderr: (stderr + "\n[timed out]").trim(), truncated });
    }, timeoutMs);
    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ code: null, stdout, stderr: `spawn 失败: ${err.message}`, truncated });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, truncated: truncated || undefined });
    });
  });
}
