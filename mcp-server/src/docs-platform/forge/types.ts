/**
 * ForgeDocStore 使用的类型定义。
 * 与 process-forge-docs.js 产出的 index JSON 结构一一对应。
 */

export interface L2Entry {
  id: string;
  version: string;
  label: string;
  url: string;
  tags: string[];
  sections: Array<{ title: string; level: number; summary: string }>;
  hasCodeBlocks: boolean;
  codeBlockCount: number;
  keySections: number;
  /** raw/*.md 文件名 */
  file: string;
  /** processed/*.md 文件名（含 processed/ 前缀） */
  processedFile: string;
}
