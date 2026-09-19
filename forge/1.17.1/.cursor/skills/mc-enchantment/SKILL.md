---
name: mc-enchantment
description: 附魔注册与效果。触发词：Enchantment、Enchantments
platform: forge
version: "1.17.1"
dependencies: []
mappings: official
---

# mc-enchantment（1.17.1）

> 一手来源：类名 `Enchantment` 经 `query_api`（version=1.17.1）核实存在（官方命名）。

## Decision Flow

```
→ 自定义附魔 → Enchantment 子类（query_api 已钉）
→ 注册 → 注册表体系见本档 concepts_registries 页
→ 附魔生效逻辑 → 方法链先核实再写
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- `Enchantment` 在本档存在（query_api found，官方命名）。
- 附魔在 1.17.1 仍是代码注册面（数据驱动附魔是 1.21 起）；注册写法细节以本档 concepts_registries 页 + 核实为准。

## 反模式

- 把 1.21 的数据驱动附魔 JSON 套到 1.17.1。
- 凭记忆写注册与效果方法链。

## 下一步

- 类/方法核实：`query_api`（version=1.17.1）；反模式库：`forge/1.17.1/knowledge/antipatterns/`。
