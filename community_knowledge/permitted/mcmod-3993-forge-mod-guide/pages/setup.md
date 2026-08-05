---
id: mcmod-3993/setup
title: Forge MDK 与工程搭建要点
tags: [setup, mdk, gradle, idea]
mcHint: 1.18.x+
---

# Forge MDK 与工程搭建要点

> 提炼自 MC百科教程（耿悠博），主体偏 1.18；细节以官方 Getting Started 为准。

## 要点

1. 使用对应 MC 版本的 **Forge MDK**，用 IDEA 打开解压目录。
2. 确认 **JDK**：1.18+ 通常需要 **Java 17**；配置 `JAVA_HOME` 与 Path。
3. 修改包名 / `mods.toml` 的 `modId`（全小写）、`displayName`、依赖中的 forge / minecraft 版本范围。
4. 首次构建：Gradle `build`；部分 1.20.x MDK 需先跑 setup 类任务。
5. `mappings channel` 常见为 `official` 或 `parchment`；换映射后需重新 setup。

## 注意

- 不要把文本硬编码进代码，优先语言文件（本地化键）。
- API 与注册细节请再用 `search_forge_docs` / 平台 rules 核对当前版本。
