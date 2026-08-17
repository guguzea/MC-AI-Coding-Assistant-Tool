---
description: 09 — 反模式（NeoForge 1.21.10）
globs:
alwaysApply: true
status: ready
---

# 09 — 反模式（NeoForge 1.21.10）

- 读邻档 00–10 或把 1.20.4/1.21.3/26.1 方法名改版本号
- SimpleChannel / net.minecraftforge
- 把 query_api 当本版 Vanilla 索引（1.21+ 无索引）
- 无 docs 却编造类名

## Decision Flow

```
→ 不确定 → search_neoforge_docs version=1.21.10，禁止邻档
```
