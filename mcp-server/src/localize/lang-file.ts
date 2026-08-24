/**
 * .lang 格式（pre-flattening Java 版 <1.13 与基岩 Add-On 同族）解析/序列化。
 *
 * 语法：`key=value`（首个 = 分隔）；`#` 开头为注释；空行忽略。
 * 值中的换行以字面 `\n` 转义表示——本模块不做反转义，保持原文以便 diff/占位符比对；
 * 序列化时把值里的真实换行转回 `\n` 字面量，防止破坏行式结构（D-5）。
 */

import type { LangMap } from "./lang-diff.js";

export function parseDotLang(text: string): { ok: true; value: LangMap } | { ok: false; error: string } {
  const out: LangMap = {};
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) {
      // 无 = 的非注释行：返回错误——宁可报错也不静默吞行（.lang 方言差异大，损坏行不该被跳过）
      return { ok: false, error: `.lang 第 ${i + 1} 行不是 key=value：${trimmed.slice(0, 40)}` };
    }
    const key = trimmed.slice(0, eq).trim();
    out[key] = trimmed.slice(eq + 1).trim();
  }
  return { ok: true, value: out };
}

export function serializeDotLang(map: LangMap): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(map)) {
    const value = String(v ?? "").replace(/\r?\n/g, "\\n");
    lines.push(`${k}=${value}`);
  }
  return lines.join("\n") + "\n";
}
