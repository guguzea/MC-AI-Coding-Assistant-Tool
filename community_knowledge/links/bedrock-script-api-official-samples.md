---
id: links/bedrock-script-api-official-samples
title: 基岩版官方文档与示例仓库索引（外链）
url: https://learn.microsoft.com/minecraft/creator/
summary: Microsoft Learn 基岩创作者文档主页 + 官方示例仓库（behavior pack samples、script API samples、starter kits）；本地 search_bedrock_docs 的线上补充。
tags: [index, bedrock, script-api, addon, microsoft-learn, link-only]
sourceKind: links
mcHint: stable / preview 双线
---

# 基岩版官方创作者文档与示例（外链）

- 文档主页：https://learn.microsoft.com/minecraft/creator/
- 本地已有：`search_bedrock_docs` / `get_bedrock_doc_*` 收录 stable 线（约 20 页，含 script-api-intro、entity-components、custom-block 等）；本条是**线上补充与示例代码入口**。

## 官方 GitHub 示例仓库（核实存在）

| 仓库 | 内容 |
|------|------|
| https://github.com/Mojang/bedrock-samples | 官方资源包/行为包样例 + 附加包模板，Script API 示例齐全 |
| https://github.com/Mojang/minecraft-preview-changelogs 或版本公告 | Script API 版本变更（以 learn 页为准） |

## 用法

- Script API 模块名/接口随版本演进快（@minecraft/server 1.x → 2.x），**写码前先开原文确认当前 beta/stable 模块版本**；禁止拿旧教程接口名硬写。
- 社区中文向导（如 wiki.mcbedev.net 类站点）未入库未核实；需要时自行打开并遵守其转载政策。

相关本库短文：`authored/bedrock-script-api-primer`（自写入门要点）。
