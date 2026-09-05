/**
 * 统一抓取层（维护脚本专用）。三条不变式：
 *  1. curl 腿永远带 `--ssl-no-revoke` + UA —— Windows schannel 默认查吊销，
 *     本机离线/AD 环境会直接 `CRYPT_E_NO_REVOCATION_CHECK` 失败，而 `curl.exe --ssl-no-revoke` 同一 URL 成功。
 *  2. fetch 腿永远带 `AbortSignal.timeout()` + UA —— 没有超时的 fetch 会把脚本挂死在半开连接上。
 *  3. 失败必须分类：TLS/证书类失败命名成 `TLS_*`，**禁止**被记成 `NOT_FOUND`／「资源不存在」。
 *
 * 风格参照 scripts/fetch-neoforge-primers.mjs 的 fetchUrl（UA + AbortSignal.timeout + 退避重试）。
 */
import { existsSync, rmSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

export const USER_AGENT = "MC-AI-Coding-Assistant-Tool";
export const DEFAULT_TIMEOUT_MS = 30_000;

/** 失败类别。TLS_* 与 NOT_FOUND 必须互斥。 */
export const FETCH_FAILURE = Object.freeze({
  TLS_VERIFY_FAILED: "TLS_VERIFY_FAILED",
  TLS_REVOCATION_CHECK_FAILED: "TLS_REVOCATION_CHECK_FAILED",
  TLS_HANDSHAKE_FAILED: "TLS_HANDSHAKE_FAILED",
  TIMEOUT: "TIMEOUT",
  RATE_LIMITED: "RATE_LIMITED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONNECTION_REFUSED: "CONNECTION_REFUSED",
  DNS_FAILURE: "DNS_FAILURE",
  HTTP_ERROR: "HTTP_ERROR",
  UNKNOWN: "UNKNOWN",
});

const TLS_PATTERNS = [
  [/CRYPT_E_NO_REVOCATION_CHECK|CRYPT_E_REVOKED|SEC_E_|TRUST_E_/i, FETCH_FAILURE.TLS_REVOCATION_CHECK_FAILED],
  [/revocation|certificate revoked/i, FETCH_FAILURE.TLS_REVOCATION_CHECK_FAILED],
  [
    /unable to get local issuer certificate|certificate has expired|self[- ]signed|self signed certificate|`?unable to verify the first certificate`?|DEPTH_ZERO_SELF_SIGNED_CERT|DEPTH_SELF_SIGNED_CERT|UNABLE_TO_VERIFY_LEAF_SIGNATURE|CERT_UNTRUSTED|CERT_HAS_EXPIRED|ERR_TLS_CERT_ALTNAME_INVALID|SSL certificate problem|certificate verify failed|ssl_verif|schannel: failed to receive handshake|not after|not before/i,
    FETCH_FAILURE.TLS_VERIFY_FAILED,
  ],
  [/SSL connect error|error:0A000410|error:14094410|sslv3 alert|handshake failure|wrong version number|tls_|TLS/ , FETCH_FAILURE.TLS_HANDSHAKE_FAILED],
];

/** curl 退出码 → 类别（60/35/77/91 = SSL；6=DNS；7=连接；28=超时；22=-f 时 HTTP 错误）。 */
const CURL_EXIT_CLASS = {
  35: FETCH_FAILURE.TLS_HANDSHAKE_FAILED,
  60: FETCH_FAILURE.TLS_VERIFY_FAILED,
  77: FETCH_FAILURE.TLS_VERIFY_FAILED,
  91: FETCH_FAILURE.TLS_HANDSHAKE_FAILED,
  6: FETCH_FAILURE.DNS_FAILURE,
  7: FETCH_FAILURE.CONNECTION_REFUSED,
  28: FETCH_FAILURE.TIMEOUT,
};

function classifyTlsText(text) {
  const s = String(text || "");
  if (!s) return null;
  for (const [re, cls] of TLS_PATTERNS) if (re.test(s)) return cls;
  return null;
}

function rateLimited(status, headers = {}) {
  if (status === 429) return true;
  if (status !== 403) return false;
  const h = headers || {};
  const get = (k) => h[k] ?? h[k.toLowerCase()] ?? h[k.replace(/-/g, "_")];
  const remaining = get("x-ratelimit-remaining") ?? get("ratelimit-remaining");
  const reset = get("x-ratelimit-reset") ?? get("ratelimit-reset");
  if (remaining !== undefined && Number.parseInt(String(remaining), 10) === 0) return true;
  if (get("retry-after") !== undefined && reset !== undefined) return true;
  return false;
}

/** undici 把 TLS/超时真因放在 e.cause 链上，必须摊平后才能分类。 */
function describeError(error) {
  if (!error) return "";
  if (typeof error === "string") return error;
  const parts = [];
  let cur = error;
  for (let depth = 0; cur && depth < 5; depth++) {
    parts.push(`${cur.name || "Error"}: ${cur.message || ""} ${cur.code || ""} ${cur.errno || ""}`.trim());
    cur = cur.cause;
  }
  return parts.join(" | ");
}

/**
 * 把一次失败（HTTP 状态码或异常文本）归到唯一类别。
 * @returns {{failureClass: string, tls: boolean, retryable: boolean, status: number, reason: string}}
 */
export function classifyFailure({ status = 0, error, headers, curlExit } = {}) {
  const errText = describeError(error);
  if (!status) {
    // 传输层失败：先认 TLS，再认超时/拒连/DNS —— 绝不允许落到 NOT_FOUND
    const tls = classifyTlsText(errText);
    if (tls) {
      return { failureClass: tls, tls: true, retryable: false, status: 0, reason: errText || "TLS 校验失败" };
    }
    if (curlExit !== undefined && CURL_EXIT_CLASS[curlExit]) {
      const cls = CURL_EXIT_CLASS[curlExit];
      return {
        failureClass: cls,
        tls: String(cls).startsWith("TLS_"),
        retryable: cls === FETCH_FAILURE.TIMEOUT,
        status: 0,
        reason: errText || `curl exit ${curlExit}`,
      };
    }
    if (/AbortError|TimeoutError|ETIMEDOUT|ESOCKETTIMEDOUT|UND_ERR_HEADERS_TIMEOUT|UND_ERR_CONNECT_TIMEOUT|timed? out|timeout/i.test(errText)) {
      return { failureClass: FETCH_FAILURE.TIMEOUT, tls: false, retryable: true, status: 0, reason: errText };
    }
    if (/ECONNREFUSED|ECONNRESET|EPIPE|EHOSTUNREACH|ENETUNREACH|connection (?:refused|closed|reset)|other side closed|socket disconnect/i.test(errText)) {
      return { failureClass: FETCH_FAILURE.CONNECTION_REFUSED, tls: false, retryable: true, status: 0, reason: errText };
    }
    if (/ENOTFOUND|EAI_AGAIN|getaddrinfo/i.test(errText)) {
      return { failureClass: FETCH_FAILURE.DNS_FAILURE, tls: false, retryable: true, status: 0, reason: errText };
    }
    return { failureClass: errText ? FETCH_FAILURE.UNKNOWN : FETCH_FAILURE.HTTP_ERROR, tls: false, retryable: true, status: 0, reason: errText || "无 HTTP 状态" };
  }
  if (status === 404 || status === 410 || status === 422) {
    return { failureClass: FETCH_FAILURE.NOT_FOUND, tls: false, retryable: false, status, reason: `HTTP ${status}` };
  }
  if (rateLimited(status, headers)) {
    return { failureClass: FETCH_FAILURE.RATE_LIMITED, tls: false, retryable: true, status, reason: `HTTP ${status} + rate-limit headers` };
  }
  if (status === 403) {
    return { failureClass: FETCH_FAILURE.FORBIDDEN, tls: false, retryable: false, status, reason: "HTTP 403" };
  }
  return { failureClass: FETCH_FAILURE.HTTP_ERROR, tls: false, retryable: status >= 500, status, reason: `HTTP ${status}` };
}

/** 人读结论：明确写「不是资源不存在」，防止台账把 TLS 故障记成 404。 */
export function failureNote(res) {
  if (!res || res.ok) return "";
  const cls = res.failureClass || FETCH_FAILURE.UNKNOWN;
  const tail = res.status ? ` HTTP ${res.status}` : "";
  if (res.tls) return `${cls}${tail}（TLS/证书问题，≠ 资源不存在 NOT_FOUND）`;
  if (cls === FETCH_FAILURE.RATE_LIMITED) return `${cls}${tail}（限流，稍后重试，≠ 资源不存在）`;
  if (cls === FETCH_FAILURE.TIMEOUT || cls === FETCH_FAILURE.CONNECTION_REFUSED || cls === FETCH_FAILURE.DNS_FAILURE) {
    return `${cls}${tail}（网络不可达，≠ 资源不存在 NOT_FOUND）`;
  }
  return `${cls}${tail}`;
}

/** curl（win32）腿：始终 --ssl-no-revoke + UA。 */
export function curlDownload({ url, dest, timeoutMs = DEFAULT_TIMEOUT_MS, minBytes = 1000, headers = {} } = {}) {
  const args = [
    "-fsSL",
    "--ssl-no-revoke",
    "--retry", "3",
    "--retry-delay", "2",
    "--connect-timeout", String(Math.max(5, Math.floor(timeoutMs / 1000))),
    "--max-time", String(Math.max(10, Math.floor(timeoutMs / 1000))),
    "-A", USER_AGENT,
  ];
  for (const [k, v] of Object.entries(headers)) args.push("-H", `${k}: ${v}`);
  args.push("-o", dest, url);
  const r = spawnSync("curl.exe", args, { windowsHide: true, encoding: "utf8" });
  const stderr = `${r.stderr || ""}${r.stdout || ""}`;
  if (r.error) {
    rmSync(dest, { force: true });
    return { ok: false, via: "curl", ...classifyFailure({ error: r.error, curlExit: undefined }) };
  }
  if (r.status === 0 && existsSync(dest) && statSync(dest).size > minBytes) {
    return { ok: true, via: "curl", path: dest, bytes: statSync(dest).size, status: 200 };
  }
  const httpErr = /the requested URL returned error: (\d{3})/i.exec(stderr);
  const status = httpErr ? Number.parseInt(httpErr[1], 10) : 0;
  const classified = classifyFailure({ status, error: stderr || `curl exit ${r.status}`, curlExit: r.status });
  rmSync(dest, { force: true });
  return { ok: false, via: "curl", curlExit: r.status, ...classified, reason: `${classified.reason} ${stderr}`.trim().slice(0, 400) };
}

/** fetch 腿：始终 UA + AbortSignal.timeout。as = text | buffer | json | none */
export async function fetchWithUa(url, { method = "GET", headers = {}, timeoutMs = DEFAULT_TIMEOUT_MS, as = "text" } = {}) {
  try {
    const res = await fetch(url, {
      method,
      redirect: "follow",
      headers: { "User-Agent": USER_AGENT, ...headers },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const picked = {};
    for (const k of ["x-ratelimit-remaining", "x-ratelimit-reset", "ratelimit-remaining", "retry-after"]) {
      const v = res.headers?.get?.(k);
      if (v !== null && v !== undefined) picked[k] = v;
    }
    let text = "";
    let buf;
    if (as === "buffer") buf = Buffer.from(await res.arrayBuffer());
    else if (as !== "none") text = await res.text();
    if (!res.ok) {
      return { ok: false, status: res.status, headers: picked, text, ...classifyFailure({ status: res.status, headers: picked, error: `HTTP ${res.status} ${text.slice(0, 200)}` }) };
    }
    return {
      ok: true,
      status: res.status,
      headers: picked,
      text,
      buf,
      json: as === "json" ? safeJson(text) : undefined,
      note: as === "buffer" ? undefined : res.headers?.get?.("content-type") || undefined,
    };
  } catch (e) {
    return { ok: false, status: 0, headers: {}, text: "", ...classifyFailure({ error: e }) };
  }
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function fetchTextWithUa(url, opts = {}) {
  return fetchWithUa(url, { ...opts, as: "text" });
}

export async function fetchJsonWithUa(url, opts = {}) {
  const r = await fetchWithUa(url, { ...opts, as: "json" });
  if (r.ok && !r.json) {
    return { ...r, ok: false, failureClass: FETCH_FAILURE.UNKNOWN, reason: "响应不是合法 JSON" };
  }
  return r;
}

export async function fetchBufferWithUa(url, opts = {}) {
  return fetchWithUa(url, { ...opts, as: "buffer" });
}

/** curl 优先、fetch 兜底；两条腿都失败时返回带 failureClass 的结果（绝不返回 NOT_FOUND 除非真是 404）。 */
export async function downloadWithFallback({ url, dest, timeoutMs = DEFAULT_TIMEOUT_MS, minBytes = 1000, headers = {}, preferCurl = process.platform === "win32" } = {}) {
  let curlRes;
  if (preferCurl) {
    curlRes = curlDownload({ url, dest, timeoutMs, minBytes, headers });
    if (curlRes.ok) return curlRes;
    // 真 404 不必再走 fetch 腿；其余失败（含 TLS_*）换 Node fetch 再试，归类保持 TLS
    if (curlRes.failureClass === FETCH_FAILURE.NOT_FOUND) return curlRes;
  }
  const viaFetch = await fetchBufferWithUa(url, { timeoutMs, headers });
  if (viaFetch.ok) {
    writeFileSync(dest, viaFetch.buf);
    return { ok: true, via: "fetch", path: dest, bytes: statSync(dest).size, status: viaFetch.status };
  }
  const merged = { ...viaFetch, path: undefined, bytes: 0 };
  if (curlRes) merged.reason = `${curlRes.reason || failureNote(curlRes)} | ${viaFetch.reason || failureNote(viaFetch)}`.slice(0, 500);
  return merged;
}
