---
name: mc-ai
description: 实体 AI Goal、Brain。触发词：Goal、targetSelector
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# mc-ai（1.12.2）

> 一手来源：类名 `EntityAIBase` / `EntityAITasks` / `EntityLiving` 经 `query_api`（version=1.12.2）逐一核实存在（MCP 命名）。goal 注册/任务挂载的具体方法链本档无一手语料——写前用 `get_method_params` / 反编译核实。

## Decision Flow

```
→ 实体行为 = 优先级任务系统 → EntityAIBase 子类（MCP 名，query_api 已钉）
→ 任务挂载 → EntityAITasks（query_api 已钉；addTask 签名先核实再写）
→ 行为主体 → EntityLiving 系（query_api 已钉）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- 1.12.2 的 AI 类名是 **EntityAIBase / EntityAITasks**（MCP 命名）——1.13+ 官方命名改为 Goal / GoalSelector，两代名字不可混用。
- 具体挂载方法（如 tasks.addTask(priority, ai)）在本仓无一手来源，写前核实。

## 反模式

- 把 1.13+ 的 `Goal` / `GoalSelector` 写进 1.12.2 工程。
- 凭记忆写任务挂载链（本档无一手语料；核实后写）。

## 下一步

- 类/方法核实：`query_api`（version=1.12.2，注意 methods 可能为空壳）+ 反编译；反模式库：`forge/1.12.2/knowledge/antipatterns/`。
