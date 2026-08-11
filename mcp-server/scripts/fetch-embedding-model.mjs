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
  await pipeline("feature-extraction", MODEL);
  console.log(`[ok] 模型已缓存: ${cacheDir}/${MODEL}`);
}

main().catch((e) => {
  console.error("[FAIL] fetch:embedding-model:", e?.message ?? e);
  process.exit(1);
});
