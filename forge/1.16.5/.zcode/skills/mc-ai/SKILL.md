---
name: mc-ai
description: 实体 AI Goal、Brain。触发词：Goal、targetSelector
platform: forge
version: "1.16.5"
dependencies: []
mappings: mcp
---

# mc-ai（1.16.5）

> 一手来源：类名 `Goal` / `GoalSelector` 经 `query_api`（version=1.16.5）核实存在（官方/mojmap 命名；注意 `Mob` 在 1.16.5 索引 found=false，勿声称）。

## Decision Flow

```
→ 实体行为 = 优先级 Goal 系统 → Goal 子类（query_api 已钉）
→ goal 容器 → GoalSelector（query_api 已钉；挂载方法签名先核实再写）
→ 实体侧接入点 → 写前核实（Mob 类名在本档索引不命中，勿凭记忆）
→ 注册与生命周期 → mc-registry、01-registry.mdc、04-entity.mdc
```

## 本档口径（已核实）

- 1.16.5 起用 **Goal / GoalSelector**（官方命名；与 1.12.2 的 EntityAIBase/EntityAITasks 完全两代）。
- goal 挂载方法与优先级参数在本仓无一手语料，写前 `get_method_params` / 反编译核实。

## 反模式

- 把 1.12.2 的 EntityAIBase/EntityAITasks 写进 1.16.5 工程。
- 在本档声称 `Mob` 类（1.16.5 索引不命中；用前先核实类名）。
- 凭记忆写 goalSelector 挂载链。

## 下一步

- 类/方法核实：`query_api`（version=1.16.5）；反模式库：`forge/1.16.5/knowledge/antipatterns/`、`04-entity.mdc`。
