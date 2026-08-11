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

let cachedProbe: JavaProbe | null = null;

/** 解析 `java -version` 输出首行 → major。1.8.0_431 → 8；17.0.9 → 17 */
export function parseJavaMajor(line: string): number | null {
  const m = /version\s+"([^"]+)"/.exec(line);
  if (!m) return null;
  const ver = m[1];
  const oldStyle = /^1\.(\d+)(?:[._]|$)/.exec(ver);
  if (oldStyle) return Number(oldStyle[1]);
  const newStyle = /^(\d+)\./.exec(ver);
  if (newStyle) return Number(newStyle[1]);
  return null;
}

function resolveJavaPath(): string | null {
  const javaHome = process.env.JAVA_HOME;
  if (javaHome && existsSync(javaHome)) {
    const candidate = join(javaHome, "bin", process.platform === "win32" ? "java.exe" : "java");
    if (existsSync(candidate)) return candidate;
  }
  return "java"; // PATH
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

/** 惰性探测 Java（force=true 时重跑）。永不抛出——所有失败折叠为 ready=false。 */
export async function probeJava(force = false): Promise<JavaProbe> {
  if (cachedProbe && !force) return cachedProbe;
  const javaPath = resolveJavaPath();
  let probe: JavaProbe;
  if (javaPath === null) {
    probe = { ready: false, major: null, versionText: null, javaPath: null, reason: "NOT_FOUND" };
  } else {
    try {
      const { stdout, stderr } = await runJavaVersion(javaPath);
      const all = (stdout + "\n" + stderr).trim();
      const firstLine = all.split("\n")[0] ?? "";
      const major = parseJavaMajor(firstLine);
      if (major === null) {
        probe = {
          ready: false,
          major: null,
          versionText: firstLine || null,
          javaPath,
          reason: "NOT_FOUND",
        };
      } else if (major < MIN_JAVA_MAJOR) {
        probe = {
          ready: false,
          major,
          versionText: firstLine,
          javaPath,
          reason: "TOO_OLD",
        };
      } else {
        probe = { ready: true, major, versionText: firstLine, javaPath, reason: "OK" };
      }
    } catch {
      probe = { ready: false, major: null, versionText: null, javaPath, reason: "NOT_FOUND" };
    }
  }
  if (!force) cachedProbe = probe;
  return probe;
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

export interface JavaRunResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

/** 运行 Java 子进程（已探测过的 javaPath；超时/信号 → code=null + stderr 说明） */
export async function runJava(
  args: string[],
  opts: { javaPath?: string | null; timeoutMs?: number; cwd?: string; env?: NodeJS.ProcessEnv } = {},
): Promise<JavaRunResult> {
  const javaPath = opts.javaPath ?? (await probeJava()).javaPath ?? "java";
  const timeoutMs = opts.timeoutMs ?? 15 * 60_000;
  return new Promise((resolve) => {
    const child = spawn(javaPath, args, {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
      cwd: opts.cwd,
      env: opts.env ? { ...process.env, ...opts.env } : process.env,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    const timer = setTimeout(() => {
      child.kill();
      resolve({ code: null, stdout, stderr: (stderr + "\n[timed out]").trim() });
    }, timeoutMs);
    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ code: null, stdout, stderr: `spawn 失败: ${err.message}` });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });
  });
}
