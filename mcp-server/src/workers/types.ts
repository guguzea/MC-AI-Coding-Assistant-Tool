// Shared type definitions

export interface WorkerMessage {
  type: "start";
  timeout?: number;
}

export interface WorkerReadyMessage {
  type: "ready";
  /** apiIndex: 直接传解析后的对象（v8 序列化）。主线程直接使用，无需 JSON.parse */
  apiIndex: Record<string, unknown>;
  classNames: string[];
  l0Index: unknown;
  trieFlat: unknown;
  trieSkipped?: boolean;
  elapsed: number;
  classCount: number;
}

export interface WorkerErrorMessage {
  type: "error";
  errors: string[];
}

export type WorkerOutMessage = WorkerReadyMessage | WorkerErrorMessage;
