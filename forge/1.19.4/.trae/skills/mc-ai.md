---
name: mc-ai
description: 实体 AI Goal、Brain。触发词：Goal、targetSelector
platform: forge
version: "1.19.4"
dependencies: []
mappings: mcp
---

# mc-ai（1.19.4）

> 一手来源：类名 `Goal` / `GoalSelector` 经 `query_api`（version=1.19.4）核实存在（官方命名）。

## Decision Flow

```
→ 实体行为 = 优先级 Goal 系统 → Goal 子类
→ goal 容器 → GoalSelector（挂载方法签名先核实再写）
→ 注册与生命周期 → mc-registry、01-registry.mdc、04-entity.mdc
```

## 本档口径（已核实）

- `Goal` / `GoalSelector` 在本档存在（query_api found）。
- goal 挂载方法与优先级参数在本仓无一手语料，写前核实。

## 反模式

- 混用 1.12.2 的 EntityAIBase 名（两代命名）。
- 凭记忆写 goalSelector 挂载链。

## 下一步

- 类/方法核实：`query_api`（version=1.19.4）；反模式库：`forge/1.19.4/knowledge/antipatterns/`、`04-entity.mdc`。
