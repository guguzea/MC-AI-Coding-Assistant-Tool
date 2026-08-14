---
description: 06 — Molang
---

# 06 — Molang

表达式用 Molang，不是 Java / JavaScript。查询以 Learn 为准，禁止臆造 `q.fakeQuery`。

## Decision Flow

```
→ 入门 → stable/molang-intro
→ 语法/函数 → stable/molang-syntax
→ 用在动画、战利品、实体 JSON → 短表达式；不要把 @minecraft/server 脚本当 Molang
→ 不确定的 query → 打开 syntax 页
```

## 已核实约束（Learn molang-intro）

Learn 示例用完整 `query.` / `math.` 前缀，例如：

- `query.last_hit_by_player`
- `query.life_time`
- `Math.Random(1,3)` / `math.sin(...)`

简写 `q.` / `v.` 以 `stable/molang-syntax` 为准；语法页没有的查询禁止输出。

Molang 写在 JSON 字符串里（动画、战利品 `on_death`、实体事件）。Script API 的 `world.afterEvents` 不是 Molang。

## 文档

`stable/molang-intro`、`stable/molang-syntax`。
