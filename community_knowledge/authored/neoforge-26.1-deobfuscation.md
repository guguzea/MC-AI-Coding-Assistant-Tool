---
mcHint: NeoForge 26.1
id: authored/neoforge-26.1-deobfuscation
title: NeoForge 26.1 去混淆（官方博客摘录）
tags: [26.1, neoforge, mappings, mojmap, parchment]
summary: Mojang 在 26.1 去掉混淆；NeoForm 版本号改为 `<mc>-<build>`；可删 Parchment 配置。短文不是 API 规范。
sourceKind: authored
url: https://neoforged.net/news/26.1release/
---

# NeoForge 26.1 去混淆

依据官方博客 https://neoforged.net/news/26.1release/（2026-08-15 查阅）。**不是** 00–10 类名来源。

## 摘录

> Mojang has removed obfuscation in 26.1. For modders, this means that the official parameter names used by the developers of Minecraft are now available!

> NeoForm versions are now of the form `<mc>-<build>`. For example, `26.1-1` for the first NeoForm build for Minecraft `26.1`.

> Parchment can be removed since Mojang’s parameter names are now available thanks to the removal of obfuscation.

示例（博客中的删除）：

```
- neoForge.parchment.minecraftVersion=1.21
- neoForge.parchment.mappingsVersion=2024.07.28
```

## Agent 口径

- 规则树用 `neoforge/26.1/`，不要并进 `1.21.1`。
- 不为 26.1.1 单造规则树。
- `/docs/26.2/` 仍 404 时不要克隆 `neoforge_26.1` 冒充 26.2。
- 26.1.x / 26.2 MDK 同时提供 ModDevGradle 与 NeoGradle，`download_official_mdk` 必须传 `buildPlugin`。

不清楚时打开原文 + Primer https://docs.neoforged.net/primer/docs/26.1/ + `search_neoforge_docs`。
