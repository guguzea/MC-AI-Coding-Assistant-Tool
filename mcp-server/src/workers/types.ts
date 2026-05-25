// 共享类型定义

export interface WorkerMessage {
  type: "start";
}

export interface WorkerReadyMessage {
  type: "ready";
  _apiIndexStr: string;
  classNames: string[];
  l0Index: unknown;
  trieFlat: unknown;
  elapsed: number;
  classCount: number;
}

export interface WorkerErrorMessage {
  type: "error";
  errors: string[];
}

export type WorkerOutMessage = WorkerReadyMessage | WorkerErrorMessage;
