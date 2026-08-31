/**
 * GitHub HTTP：Node fetch 优先；Windows 上 TLS 证书失败时回退 curl.exe（Schannel + --ssl-no-revoke）。
 *
 * 浏览器 / PowerShell 走 Windows 证书库，Node 走 Mozilla CA。公司网关 / 杀毒 HTTPS 扫描
 * 注入的根证书只在系统库里 → Node 报 UNABLE_TO_VERIFY_LEAF_SIGNATURE，表现为 UPDATE_CHECK_FAILED。
 */

import { execFile, type ExecFileException } from "node:child_process";
import { existsSync, statSync } from "node:fs";

function execFileStdin(
  file: string,
  args: string[],
  opts: {
    encoding: "buffer";
    maxBuffer?: number;
    windowsHide?: boolean;
    input?: Buffer;
  },
): Promise<{ stdout: Buffer }>;
function execFileStdin(
  file: string,
  args: string[],
  opts: {
    encoding: "utf8";
    maxBuffer?: number;
    windowsHide?: boolean;
    input?: string;
  },
): Promise<{ stdout: string }>;
function execFileStdin(
  file: string,
  args: string[],
  opts: {
    encoding: "buffer" | "utf8";
    maxBuffer?: number;
    windowsHide?: boolean;
    input?: Buffer | string;
  },
): Promise<{ stdout: Buffer | string }> {
  return new Promise((resolve, reject) => {
    const child = execFile(
      file,
      args,
      {
        encoding: opts.encoding === "buffer" ? "buffer" : "utf8",
        maxBuffer: opts.maxBuffer,
        windowsHide: opts.windowsHide,
      } as Parameters<typeof execFile>[2],
      (err: ExecFileException | null, stdout: string | Buffer) => {
        if (err) reject(err);
        else resolve({ stdout });
      },
    );
    if (opts.input != null) child.stdin?.end(opts.input);
    else child.stdin?.end();
  });
}

export type FetchFn = (url: string, init?: RequestInit) => Promise<Response>;

export function collectErrorText(err: unknown): string {
  const e = err as Error & { cause?: unknown; code?: string };
  const cause =
    e?.cause instanceof Error
      ? `${e.cause.message}${(e.cause as { code?: string }).code ? ` [${(e.cause as { code?: string }).code}]` : ""}`
      : e?.cause
        ? String(e.cause)
        : "";
  return [e?.name, e?.message, e?.code, cause].filter(Boolean).join(" | ");
}

export function isTlsCertError(err: unknown): boolean {
  return /UNABLE_TO_VERIFY|CERT_|SELF_SIGNED|unable to verify the first certificate|unable to get local issuer|UNABLE_TO_GET_ISSUER/i.test(
    collectErrorText(err),
  );
}

export function rewriteGithubApiUrl(url: string): string {
  const base = (process.env.MC_SKILL_GITHUB_API_BASE ?? "https://api.github.com").replace(/\/$/, "");
  if (url.startsWith("https://api.github.com")) {
    return base + url.slice("https://api.github.com".length);
  }
  return url;
}

export function githubTimeoutMs(): number {
  const n = Number(process.env.MC_SKILL_GITHUB_TIMEOUT_MS ?? "25000");
  return Number.isFinite(n) && n > 0 ? n : 25_000;
}

export function networkFailureNextSteps(): string[] {
  return [
    "浏览器能打开 github.com 不代表 Node fetch 能访问 api.github.com（证书库不同；系统代理也不会自动给 Node）",
    "Windows：本工具会在 TLS 证书失败时自动改用 curl.exe --ssl-no-revoke",
    "若使用 Clash/V2Ray：设置 HTTPS_PROXY=http://127.0.0.1:<端口>",
    "可选：MC_SKILL_GITHUB_TOKEN；MC_SKILL_GITHUB_API_BASE 指向可用镜像；NODE_EXTRA_CA_CERTS 指向公司根证书",
    "稍后重试",
  ];
}

function proxyUrl(): string | undefined {
  const proxy =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy ||
    process.env.ALL_PROXY ||
    process.env.all_proxy;
  return proxy?.trim() || undefined;
}

function headersToPairs(init?: RequestInit): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  new Headers(init?.headers).forEach((v, k) => out.push([k, v]));
  return out;
}

function isAllowedGithubHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "api.github.com" || h === "github.com" || h === "objects.githubusercontent.com" || h === "release-assets.githubusercontent.com") {
    return true;
  }
  const envBase = process.env.MC_SKILL_GITHUB_API_BASE;
  if (envBase) {
    try {
      return new URL(envBase).hostname.toLowerCase() === h;
    } catch {
      return false;
    }
  }
  return false;
}

function assertAllowedGithubUrl(url: string): void {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") {
    throw new Error(`拒绝非 HTTPS 重定向: ${parsed.protocol}`);
  }
  if (!isAllowedGithubHost(parsed.hostname)) {
    throw new Error(`拒绝重定向到未白名单主机: ${parsed.hostname}`);
  }
}

async function nodeFetch(url: string, init?: RequestInit): Promise<Response> {
  assertAllowedGithubUrl(url);
  const timeoutMs = githubTimeoutMs();
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    let signal: AbortSignal = ac.signal;
    if (init?.signal) {
      if (typeof AbortSignal.any === "function") {
        signal = AbortSignal.any([ac.signal, init.signal]);
      } else {
        init.signal.addEventListener("abort", () => ac.abort(), { once: true });
      }
    }
    const opts: RequestInit = {
      ...init,
      signal,
      redirect: init?.redirect ?? "follow",
    };
    const res = await fetch(url, opts);
    if (res.url) assertAllowedGithubUrl(res.url);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

function curlSafeToken(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/[\r\n]/g, "");
}

export async function curlGetToBuffer(
  url: string,
  init?: RequestInit,
): Promise<{ status: number; body: Buffer }> {
  assertAllowedGithubUrl(url);
  const timeoutSec = Math.max(5, Math.ceil(githubTimeoutMs() / 1000));
  const args = ["-sS", "-L", "--ssl-no-revoke", "--max-time", String(timeoutSec), "-w", "\n__MC_SKILL_HTTP_STATUS__:%{http_code}"];
  const proxy = proxyUrl();
  if (proxy) args.push("-x", proxy);
  const configLines: string[] = [];
  for (const [k, v] of headersToPairs(init)) {
    if (k.toLowerCase() === "authorization") {
      configLines.push(`header = "Authorization: ${curlSafeToken(v).replace(/"/g, '\\"')}"`);
      continue;
    }
    args.push("-H", `${curlSafeToken(k)}: ${curlSafeToken(v)}`);
  }
  if (configLines.length) args.push("-K", "-");
  args.push(curlSafeToken(url));
  let stdout: Buffer;
  try {
    ({ stdout } = await execFileStdin("curl.exe", args, {
      encoding: "buffer",
      maxBuffer: 32 * 1024 * 1024,
      windowsHide: true,
      input: configLines.length ? Buffer.from(configLines.join("\n") + "\n") : undefined,
    }));
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER") {
      throw new Error("curl 输出超过 32MB 上限");
    }
    throw err;
  }
  const text = stdout.toString("utf8");
  const m = text.match(/\n__MC_SKILL_HTTP_STATUS__:(\d+)\s*$/);
  const status = m ? Number(m[1]) : 0;
  const body = Buffer.from(m ? text.slice(0, m.index) : text, "utf8");
  return { status: status || 502, body };
}

export async function curlGetToFile(
  url: string,
  destPath: string,
  init?: RequestInit,
  timeoutMs?: number,
): Promise<{ status: number }> {
  const timeoutSec = Math.max(5, Math.ceil((timeoutMs ?? githubTimeoutMs()) / 1000));
  assertAllowedGithubUrl(url);
  const args = ["-sS", "-L", "--ssl-no-revoke", "--max-time", String(timeoutSec), "-o", destPath, "-w", "%{http_code}"];
  const proxy = proxyUrl();
  if (proxy) args.push("-x", proxy);
  const configLines: string[] = [];
  for (const [k, v] of headersToPairs(init)) {
    if (k.toLowerCase() === "authorization") {
      configLines.push(`header = "Authorization: ${curlSafeToken(v).replace(/"/g, '\\"')}"`);
      continue;
    }
    args.push("-H", `${curlSafeToken(k)}: ${curlSafeToken(v)}`);
  }
  if (configLines.length) args.push("-K", "-");
  args.push(curlSafeToken(url));
  let stdout: string;
  try {
    ({ stdout } = await execFileStdin("curl.exe", args, {
      encoding: "utf8",
      maxBuffer: 1024,
      windowsHide: true,
      input: configLines.length ? configLines.join("\n") + "\n" : undefined,
    }));
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER") {
      throw new Error("curl 输出超过缓冲区上限");
    }
    throw err;
  }
  return { status: Number(stdout.trim()) || 0 };
}

async function fetchViaCurl(url: string, init?: RequestInit): Promise<Response> {
  const method = (init?.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    throw new Error(`Windows curl 回退仅支持 GET/HEAD，收到 ${method}`);
  }
  const { status, body } = await curlGetToBuffer(url, init);
  return new Response(Uint8Array.from(body), {
    status,
    headers: { "Content-Type": "application/octet-stream" },
  });
}

export type GithubFetchMeta = { backend: "node" | "curl" };

let lastFetchMeta: GithubFetchMeta = { backend: "node" };

export function getLastGithubFetchMeta(): GithubFetchMeta {
  return lastFetchMeta;
}

/**
 * 默认 GitHub 请求：Node fetch →（Windows + TLS 证书错误）curl.exe --ssl-no-revoke。
 * 测试注入的 fetchImpl 不会走这里。
 */
export async function githubFetch(url: string, init?: RequestInit): Promise<Response> {
  const target = rewriteGithubApiUrl(url);
  const backend = (process.env.MC_SKILL_FETCH_BACKEND ?? "").toLowerCase();
  if (backend === "curl") {
    lastFetchMeta = { backend: "curl" };
    return fetchViaCurl(target, init);
  }
  try {
    lastFetchMeta = { backend: "node" };
    return await nodeFetch(target, init);
  } catch (err) {
    if (backend === "node") throw err;
    if (process.platform === "win32" && isTlsCertError(err)) {
      lastFetchMeta = { backend: "curl" };
      return fetchViaCurl(target, init);
    }
    throw err;
  }
}

export function curlDownloadLooksComplete(path: string, minBytes = 1): boolean {
  try {
    return existsSync(path) && statSync(path).size >= minBytes;
  } catch {
    return false;
  }
}
