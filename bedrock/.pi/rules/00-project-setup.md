---
description: 00 — 基岩包结构
---

# 00 — 基岩包结构

与 Java 模组 **零共享**：无 Gradle、无 `src/main/java`、无 Mixin、无 Yarn。打开含 `manifest.json`（`format_version` + `modules`）的包才走本目录。

## Decision Flow

```
→ 从零 Add-On → search_bedrock_docs id：stable/getting-started
→ 只要外观 → RP（02）+ manifest type=resources
→ 要行为/JSON 逻辑 → BP（03）+ manifest type=data
→ 要脚本 → BP scripts/ + module type=script（见 07）；依赖 @minecraft/server
→ 校验清单 → validate_addon_manifest（不是 validate_project / diagnose_gradle）
```

## 已核实约束

- 目录：`RP/`（resources）+ `BP/`（data）。脚本可放在 BP `scripts/`（scaffold 即此结构）。可选世界模板 `world_template`。
- 每个 pack 一份 `manifest.json`。`header.uuid` 与每个 `module.uuid` **必须两两不同**。
- `min_engine_version` 为 `[major, minor, patch]` 数组。Learn 教程示例用过 `[1, 21, 80]`；以目标引擎为准，不要倒灌 Java 版本号。
- 真机开发目录（Learn Getting Started / Custom Block）：`com.mojang` 下的 `development_resource_packs` / `development_behavior_packs`。Windows 发行版常见 `%appdata%\Minecraft Bedrock\users\shared\games\com.mojang`。不要用 Forge `run/mods`。
- 实验室用 Minecraft Preview / Editor，不要 `./gradlew runClient`。

## 文档

`search_bedrock_docs`：`stable/getting-started`、`stable/pack-manifest`、`stable/resource-pack`、`stable/behavior-pack`。

## 禁止

- Java `src/main/java`、`assets/<modid>/`、DeferredRegister、`query_api`、Yarn 模型路径
- `diagnose_gradle` / `convert_mapping` / `mixin_analyze`
