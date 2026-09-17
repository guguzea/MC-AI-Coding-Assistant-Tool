/**
 * 显式拉取嵌入模型到 data/_models/（唯一允许远程拉模型的入口）。
 *
 * 运行时 semanticSearch 保持 allowRemoteModels=false；构建前请先跑本脚本。
 *
 *   npm run fetch:embedding-model
 *   npm run fetch:embedding-model -- --data-root=H:/MC_skill/data
 */
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const DEFAULT_DATA_ROOT = process.env.MC_SKILL_DATA ?? join(REPO_ROOT, "..", "data");
const MODEL = "Xenova/all-MiniLM-L6-v2";
/** 下载超时（对齐 scripts/batch-decompile.mjs 的 FETCH_TIMEOUT_MS 命名；模型约数十 MB） */
const FETCH_TIMEOUT_MS = 15 * 60 * 1000;

function parseArgs(argv) {
  let dataRoot = DEFAULT_DATA_ROOT;
  for (const a of argv) {
    if (a.startsWith("--data-root=")) dataRoot = a.slice("--data-root=".length);
  }
  return { dataRoot };
}

async function main() {
  const { dataRoot } = parseArgs(process.argv.slice(2));
  mkdirSync(dataRoot, { recursive: true });
  const cacheDir = join(dataRoot, "_models");
  mkdirSync(cacheDir, { recursive: true });

  const marker = join(cacheDir, MODEL, "onnx", "model_quantized.onnx");
  if (existsSync(marker)) {
    console.log(`[ok] 模型已存在，跳过下载: ${marker}`);
    return;
  }

  console.log(`正在下载 ${MODEL} → ${cacheDir} …（需网络；数分钟）`);
  const { env, pipeline } = await import("@xenova/transformers");
  env.cacheDir = cacheDir;
  env.allowRemoteModels = true;
  env.allowLocalModels = true;
  // 审计 M5（2026-09-17）：pipeline() 不接受 AbortSignal ⇒ 用 watchdog；
  // 超时后 reject 交给 main().catch（打印错误 + 重试提示 + exit 非 0），不把进程挂死。
  let watchdog;
  const timeout = new Promise((_, reject) => {
    watchdog = setTimeout(
      () => reject(new Error(`下载超时（>${Math.round(FETCH_TIMEOUT_MS / 60000)} 分钟）：网络过慢或不可达`)),
      FETCH_TIMEOUT_MS,
    );
    watchdog.unref?.();
  });
  try {
    await Promise.race([pipeline("feature-extraction", MODEL), timeout]);
  } finally {
    clearTimeout(watchdog);
  }
  console.log(`[ok] 模型已缓存: ${cacheDir}/${MODEL}`);
}

main().catch((e) => {
  console.error("[FAIL] fetch:embedding-model:", e?.message ?? e);
  console.error("可重试：网络恢复后重跑 npm run fetch:embedding-model（已下载分片会复用缓存）。");
  process.exit(1);
});
