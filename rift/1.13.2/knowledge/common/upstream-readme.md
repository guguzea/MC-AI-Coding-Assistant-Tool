# Rift 上游 README（落盘副本）

- **抓取日**：2026-08-13
- **URL**：https://github.com/DimensionalDevelopment/Rift
- **状态**：仓库已于 2020-04-28 归档，仍只读可读。
- **说明**：主仓库 README 的 raw `master/README.md` 返回 404。以下为仓库首页可见信息 + [Rift-MDK README](https://raw.githubusercontent.com/DimensionalDevelopment/Rift-MDK/master/README.md)。

## 仓库首页

A lightweight mod loader and API for Minecraft 1.13.

## Rift-MDK README（原文摘要）

Example Rift mod. Sole purpose is being copied to quickly start a new project.

Files to change: `build.gradle`, `src/main/resources/riftmod.json`, `src/main/resources/pack.mcmeta`, this readme.

Requirements: OpenJDK 8 or higher.

Tasks:

```
./gradlew setupDevWorkspace [eclipse,idea]
./gradlew build
```

**禁止**用 Fabric `ModInitializer` / `onInitialize` 记忆填 Rift 方法名。
