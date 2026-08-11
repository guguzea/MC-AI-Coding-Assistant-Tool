/**
 * 本地语义嵌入（all-MiniLM-L6-v2，384 维，mean pooling + L2 归一化）
 *
 * - 懒加载单例：首次调用才动态 import @xenova/transformers 并建 pipeline
 * - 模型权重缓存于 <dataRoot>/_models（构建脚本与运行时共用）
 * - ⚠️ pooling/normalize 必须在调用时传参；构造时选项会被忽略，
 *   返回 last_hidden_state [1, seq, 384]（已实测验证）
 */
import { join } from "path";

export const EMBEDDING_DIM = 384;
export const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";

export interface Embedder {
  /** 批量嵌入；返回与输入等长的 Float32Array 数组，每个 [EMBEDDING_DIM] */
  embed(texts: string[]): Promise<Float32Array[]>;
}

let embedderPromise: Promise<Embedder> | null = null;

/**
 * 获取懒加载嵌入器（进程内单例）。
 * 加载失败时允许下次重试（清空缓存并重抛）。
 */
export function getEmbedder(dataRoot: string): Promise<Embedder> {
  if (!embedderPromise) {
    embedderPromise = (async () => {
      const { env, pipeline } = await import("@xenova/transformers");
      env.cacheDir = join(dataRoot, "_models");
      // 红线 2：运行时禁止静默联网——模型缺失时直接失败并降级 FTS5，而非从 Hub 静默下载
      env.allowRemoteModels = false;
      env.allowLocalModels = true;
      const extractor = await pipeline("feature-extraction", EMBEDDING_MODEL);
      return {
        async embed(texts: string[]) {
          if (texts.length === 0) return [];
          const out = await extractor(texts, { pooling: "mean", normalize: true });
          const flat = out.data as Float32Array;
          const dims = out.dims as number[];
          const n = dims[0] ?? 0;
          const d = dims[1] ?? EMBEDDING_DIM;
          const rows: Float32Array[] = [];
          for (let i = 0; i < n; i++) {
            rows.push(flat.subarray(i * d, (i + 1) * d));
          }
          return rows;
        },
      };
    })().catch((err: unknown) => {
      embedderPromise = null; // 允许下次重试
      throw err;
    });
  }
  return embedderPromise;
}

/** 归一化向量余弦相似度（向量已归一化时即点积）；空向量返回 0 */
export function cosine(a: Float32Array, b: Float32Array): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
