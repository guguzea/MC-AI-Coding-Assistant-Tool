---
mcHint: 26.x（去混淆 / 仅 mojmap）
id: authored/mc-26-no-obfuscation
title: Minecraft 26.1+ 去混淆与仅 mojmap
tags: [26.x, mappings, mojmap, yarn, neoforge, fabric]
summary: 26.1+ 游戏已去混淆；勿再灌 Yarn；文档用真实树 neoforge_26.1 / fabric_26.1.2；禁止把旧版克隆成 26.2；convert_mapping 拒绝 yarn。
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
- **文档数据（仅真实官方树，禁止克隆冒充）**：
  - NeoForge 主文档：`data/neoforge_26.1`（官方 `/docs/26.2/` 未发布前**不要**建 `neoforge_26.2`）
  - Fabric：`data/fabric_26.1.2`（官方尚无 `versions/26.2` 时**不要**建 `fabric_26.2`）
  - NeoForge primer 26.2：`data/neoforge_primers/26.2.md`（迁移差异可单独存在，不等于主文档树）
- 运行时若请求 `version=26.2`：NeoForge 可通过 `VERSION_FALLBACK` 落到 **26.1** 并标明 resolved；**禁止**用克隆目录假装已有 26.2 全文。

## Agent 自检

1. 用户项目是 26.1+？→ 默认 mojmap，禁止建议 Yarn。
2. 查 API → 先 `list_*_versions`，再 `search_*_docs`（NeoForge 默认 **26.1**，Fabric 用列出的最新如 **26.1.2**）。
3. 需要 26.2 迁移说明 → 读 NeoForge primer 26.2，不要假设主站 26.2 文档树已入库。
