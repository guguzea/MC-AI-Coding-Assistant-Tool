---
description: 00 — 工程（NeoForge 1.21.10）
globs:
alwaysApply: true
status: ready
---

# 00 — 项目结构（NeoForge 1.21.10）

来源：search_neoforge_docs `gettingstarted` / `gettingstarted/modfiles`（version=1.21.10）。不要用 ForgeGradle / Yarn 冒充。

## Decision Flow

```
→ 构建插件 → 官方同时提供 ModDevGradle（net.neoforged.moddev）与 NeoGradle（net.neoforged.gradle.userdev）。禁止按版本硬绑。download_official_mdk 须传 buildPlugin
→ Java 21；mojmap；资源 id 用 ResourceLocation
→ 入口 → @Mod + IEventBus 构造
→ 元数据 → neoforge.mods.toml
```
