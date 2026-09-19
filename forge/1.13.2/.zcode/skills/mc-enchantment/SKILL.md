---
name: mc-enchantment
description: 附魔注册与效果。触发词：Enchantment、Enchantments
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# mc-enchantment（1.13.2）

> 一手来源：类名 `Enchantment` 经 `query_api`（version=1.13.2）核实存在。注册机制本档语料无专页——写前核实。

## Decision Flow

```
→ 自定义附魔 → Enchantment 子类（query_api 已钉）
→ 注册机制 → 本档语料无一手专页，写前核实
→ 附魔生效逻辑 → 方法链先 get_method_params / 反编译核实
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- `Enchantment` 在本档存在（query_api found）。
- 注册表 id / 注册机制在本档语料中无逐字记载——以核实为准。

## 反模式

- 把 1.16+ 的注册写法当 1.13.2 正解。
- 凭记忆写 Enchantment 效果方法链。

## 下一步

- 类/方法核实：`query_api`（version=1.13.2）+ 反编译；反模式库：`forge/1.13.2/knowledge/antipatterns/`。
