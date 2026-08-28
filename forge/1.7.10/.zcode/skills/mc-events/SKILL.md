---
name: mc-events
description: Forge 1.7.10 事件方向指引。本档无独立 events 规则树。触发词：事件、Event
platform: forge
version: "1.7.10"
dependencies: []
mappings: mcp
docsTool: search_forge_docs
---

# mc-events（Forge 1.7.10）

**诚实边界**：本档只有 00/01/09 规则，**没有** `.cursor/rules/05-events.mdc`；核实表中也无事件 API 条目——事件相关类名与订阅写法在本档**未核实，禁止生成**。

需要事件 API 时：

- 用 `search_forge_docs`（version=1.7.10）查官方文档后再写
- 注册相关走本档 `01-registry.mdc` / `mc-registry`
- 禁止从邻档复制 @SubscribeEvent 示例冒充本档已核内容
