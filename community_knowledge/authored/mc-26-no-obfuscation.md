---
id: authored/mc-26-no-obfuscation
title: Minecraft 26.1+ 去混淆与仅 mojmap
tags: [26.x, mappings, mojmap, yarn, neoforge, fabric]
summary: 26.1+ 游戏已去混淆；勿再灌 Yarn；文档查 search_*_docs（默认 26.2）；convert_mapping 拒绝 yarn。
sourceKind: authored
---

# Minecraft 26.1+ 去混淆与仅 mojmap

自写短文。策略对齐 [MCDxAI/minecraft-dev-mcp](https://github.com/MCDxAI/minecraft-dev-mcp) Version Support。

## 事实

| 版本范围 | Yarn | Mojmap | 说明 |
|----------|------|--------|------|
| ≤1.21.11 | 有 | 有 | 仍混淆，映射转换有意义 |
| **26.1+** | **无** | **仅此** | jar 内已是可读 Mojang 名，**无需 remap** |

Mojang 于 2025-10 宣布停止混淆；自 26.1 起官方不再提供混淆图。

## 本仓库做法

- **不要**对 26.x 运行 `build:yarn-sqlite` / 维护 `yarn-mappings.json`。
- `convert_mapping`：`version=26.x` 且涉及 yarn/mcp → 失败并提示改用文档工具。
- `query_api`：无 26.x Parchment `api-index`；请改 `search_neoforge_docs` / `search_fabric_docs`。
- 文档数据：`data/neoforge_26.2`、`data/fabric_26.2`（若官方尚未单独发布该树，可能由 26.1 / 26.1.2 暂克隆；NeoForge primer `data/neoforge_primers/26.2.md` 有迁移差异）。

## Agent 自检

1. 用户项目是 26.1+？→ 默认 mojmap，禁止建议 Yarn。
2. 查 API → 先 `list_*_versions`，再 `search_*_docs`（默认 **26.2**）。
3. 需要迁移说明 → 读 NeoForge primer 26.2。
