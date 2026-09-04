// Shared type definitions
//
// D-51：原先这里的 `WorkerMessage { type:"start"; timeout?:number }` 已删除。
// 证据：全仓 import 本文件的只有 src/api/index.ts:24，且只取 WorkerOutMessage —— WorkerMessage 零引用；
// 而生产者 src/api/index.ts:440 实际 post 的是 `{ type:"start", timeout, dataDir }`，
// 本类型少了 dataDir，与真实入站契约脱节。入站类型的真源放在消息的读取处
// （src/workers/preloader.ts 的 PreloadMessage），避免再出现「两份都不合」的分裂。

export interface WorkerReadyMessage {
  type: "ready";
  /** apiIndex: 直接传解析后的对象（v8 序列化）。主线程直接使用，无需 JSON.parse */
  apiIndex: Record<string, unknown>;
  classNames: string[];
  trieFlat: unknown;
  trieSkipped: boolean;
  elapsed: number;
  classCount: number;
}

export interface WorkerErrorMessage {
  type: "error";
  errors: string[];
}

/**
 * D-50：预加载 running 期间收到的重复 start 不再被静默丢弃，改为排队 + 回一条 ack。
 * 主线程 src/api/index.ts 的 message 处理器只认 ready/error，未识别类型自然忽略，行为不变。
 */
export interface PreloadQueuedMessage {
  type: "queued";
  /** 当前排队的 start 请求数（只保留最新一份，故恒为 1） */
  pending: number;
  /** 距当前预加载开始已过去的 ms 数 */
  elapsedSinceStart: number;
}

export type WorkerOutMessage = WorkerReadyMessage | WorkerErrorMessage | PreloadQueuedMessage;
