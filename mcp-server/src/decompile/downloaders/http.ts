/**
 * 下载基础：plain fetch + 流式写盘 + SHA256/SHA1 校验。
 *
 * 约定：先写 <dest>.part，校验通过后 rename 为 dest；失败删除 .part。
 */

import { createHash } from "crypto";
import { createWriteStream, readFileSync, renameSync, rmSync } from "fs";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

export class DownloadError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export interface DownloadResult {
  path: string;
  sha256: string;
  sha1?: string;
  bytes: number;
}

/** 流式下载 + 可选哈希校验（下载超时 10min，可覆盖） */
export async function downloadFile(
  url: string,
  dest: string,
  opts: { expectedSha256?: string | null; expectedSha1?: string | null; label?: string; timeoutMs?: number } = {},
): Promise<DownloadResult> {
  const label = opts.label ?? url;
  const timeoutMs = opts.timeoutMs ?? 600_000;
  const partPath = dest + ".part";

  let res: Response;
  try {
    res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(timeoutMs) });
  } catch (err) {
    throw new DownloadError("DOWNLOAD_FAILED", `${label}: 请求失败 ${(err as Error).message}`);
  }
  if (!res.ok || !res.body) {
    throw new DownloadError(
      "DOWNLOAD_FAILED",
      `${label}: HTTP ${res.status} ${res.statusText}`,
    );
  }

  const sha256 = createHash("sha256");
  const sha1 = createHash("sha1");
  let bytes = 0;
  try {
    await pipeline(
      Readable.fromWeb(res.body as import("stream/web").ReadableStream),
      async function* (source: AsyncIterable<Buffer>) {
        for await (const chunk of source) {
          const b = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          bytes += b.length;
          sha256.update(b);
          sha1.update(b);
          yield b;
        }
      },
      createWriteStream(partPath),
    );
  } catch (err) {
    rmSync(partPath, { force: true });
    throw new DownloadError("DOWNLOAD_FAILED", `${label}: 写入失败 ${(err as Error).message}`);
  }

  const gotSha256 = sha256.digest("hex");
  const gotSha1 = sha1.digest("hex");

  if (opts.expectedSha256 && gotSha256 !== opts.expectedSha256.toLowerCase()) {
    rmSync(partPath, { force: true });
    throw new DownloadError(
      "SHA256_MISMATCH",
      `${label}: SHA256 校验失败 (got ${gotSha256}, expected ${opts.expectedSha256})`,
    );
  }
  if (opts.expectedSha1 && gotSha1 !== opts.expectedSha1.toLowerCase()) {
    rmSync(partPath, { force: true });
    throw new DownloadError(
      "SHA1_MISMATCH",
      `${label}: SHA1 校验失败 (got ${gotSha1}, expected ${opts.expectedSha1})`,
    );
  }

  renameSync(partPath, dest);
  return { path: dest, sha256: gotSha256, sha1: gotSha1, bytes };
}

/** 计算文件 SHA256（校验已有缓存用） */
export function fileSha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}
