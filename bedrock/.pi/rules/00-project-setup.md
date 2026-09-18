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
- `min_engine_version` 为 `[major, minor, patch]` 数组。
  - **上游实况（npm registry 一手复核，as-of 2026-09-18）**：`@minecraft/server` 的 `dist-tags.latest`（stable）= **`2.10.0`**；`beta` = **`2.11.0-beta.1.26.51-stable`**（所指引擎 **1.26.51**）；`rc` = `2.11.0-rc.1.26.60-preview.25`。
  - **本仓 `scaffold` / `generate_addon_manifest` 的默认值是 `[1, 26, 44]`**（依据是 2026-09-07 当时的 beta 串 `2.10.0-beta.1.26.44-stable`）⇒ 该默认值现已是**上一代 beta**（当前 beta 指 1.26.51）。改默认值属**代码行为变更**（`src/bedrock` 的生成器），**本轮只登记不改**。
  - 写法要求：**以目标引擎为准**，不要倒灌 Java 版本号；要显式指定就写 `min_engine_version`。
- 真机开发目录（Learn Getting Started / Custom Block）：`com.mojang` 下的 `development_resource_packs` / `development_behavior_packs`。Windows 发行版常见 `%appdata%\Minecraft Bedrock\users\shared\games\com.mojang`。不要用 Forge `run/mods`。
- 实验室用 Minecraft Preview / Editor，不要 `./gradlew runClient`。

## 文档

`search_bedrock_docs`：`stable/getting-started`、`stable/pack-manifest`、`stable/resource-pack`、`stable/behavior-pack`。

## 禁止

- Java `src/main/java`、`assets/<modid>/`、DeferredRegister、`query_api`、Yarn 模型路径
- `diagnose_gradle` / `convert_mapping` / `mixin_analyze`
