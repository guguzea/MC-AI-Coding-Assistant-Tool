#!/usr/bin/env node
// 只读：抽取文档里的「规范句」（含祈使 / 约束词的句子），用于改造前后逐条比对。
// 判据守恒的核对方式：改前抽一份、改后抽一份，diff 里只许出现「证据链句」的减少，
// 出现任何规范句消失即视为压缩越界。
//
// 用法（只往 stdout 打；需要留档自己重定向，本脚本不写盘）：
//   node scripts/extract-norms.mjs AGENTS.md > temp/norms-before.txt
// 输出：每行一条规范句（已归一化空白），按文本排序 —— 便于直接 diff。

import { readFileSync } from "node:fs";

const src = process.argv[2];
if (!src) {
  console.error("用法：node scripts/extract-norms.mjs <文件>   （输出到 stdout）");
  process.exit(2);
}

// 约束词表：出现任一即视为「规范句」。宁可多收（多收只是 diff 噪音），不可漏收。
const NORM =
  /(必须|禁止|不得|严禁|只许|一律|不允许|不要|才能|才算|须先|先问|等用户|判红|fail-closed|留 `\/\/ TODO|逐字|\bMUST\b)/;

const text = readFileSync(src, "utf8");
const rows = [];
for (const line of text.split(/\r?\n/)) {
  // 句级切分：中文句号 / 分号 / 感叹号 / 问号结尾即断句，再过滤空段
  const parts = line
    .split(/(?<=[。；！？])/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  for (const p of parts) if (NORM.test(p)) rows.push(p);
}
rows.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
process.stdout.write(rows.join("\n") + "\n");
console.error(`${src}：规范句 ${rows.length} 条`);
