---
description: 08 — 基岩世界生成 JSON
---

# 08 — 基岩世界生成 JSON

feature / biome / structure 在 BP。这是 jigsaw/feature JSON，**不是** Beta APIs 开关存放处。

## Decision Flow

```
→ 自定义 feature → stable/features-intro
→ 生物群系组件 → stable/biomes
→ 实验开关 / Beta APIs → 07，不要写进 worldgen JSON
→ 缺页（结构/噪声等）→ 标未核实，search_bedrock_docs；禁止用 Java ChunkGenerator 记忆填
```

## 已核实约束

- 入库切片目前是 `stable/features-intro` 与 `stable/biomes`。结构/噪声等 Learn 页未进 `PAGES` 时：**标未核实、禁止臆造**，再 `search_bedrock_docs`，不要用 Java `ChunkGenerator` / Fabric biome JSON 冒充。
- 禁止发明 `worldgen/experimental.json` 当 Beta 开关（见 09 / 07）。

## 文档

`stable/features-intro`、`stable/biomes`、`stable/experimental-features-toggle`。
