---
name: mc-enchantment
description: 附魔注册与效果。触发词：Enchantment、Enchantments
platform: forge
version: "1.20.4"
dependencies: []
mappings: mcp
---

# mc-enchantment（1.20.4）

> 一手来源：类名 `Enchantment` 经 `query_api`（version=1.20.4）核实存在；注册表 id 形态见本档 `concepts_registries` 页（1.20.1 同版线该页有逐字 `@ObjectHolder(registryName = "minecraft:enchantment", ...)` 条目，1.20.4 引用前翻本档原文）。

## Decision Flow

```
→ 自定义附魔 → Enchantment 子类（query_api 已钉）
→ 注册 → 注册表体系见本档 concepts_registries 页
→ 附魔生效逻辑 → 方法链先核实再写
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- `Enchantment` 在本档存在（query_api found）。
- 本版仍是代码注册面（数据驱动附魔是 1.21 起）。

## 反模式

- 把 1.21 的数据驱动附魔 JSON 套到 1.20.4。
- 凭记忆写注册与效果方法链。

## 下一步

- 类/方法核实：`query_api`（version=1.20.4）；反模式库：`forge/1.20.4/knowledge/antipatterns/`。
