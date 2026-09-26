---
name: mc-enchantment
description: 附魔注册与效果。触发词：Enchantment、Enchantments
platform: forge
version: "1.20.1"
dependencies: []
mappings: parchment
---

# mc-enchantment（1.20.1）

> 一手来源：本档 docs 语料 `data/forge_1.20.1/forge-docs/1.20.1/processed/concepts_registries.md:140-142`（逐字条目 `@ObjectHolder(registryName = "minecraft:enchantment", value = "minecraft:flame")` + 注释「Registry name is explicitly defined: "minecraft:enchantment"」）；类名 `Enchantment` 经 `query_api`（version=1.20.1）核实存在。

## Decision Flow

```
→ 自定义附魔 → Enchantment 子类（query_api 已钉）
→ 注册 → 注册表体系见本档 concepts_registries 页（minecraft:enchantment 注册表 id 逐字在档）
→ 引用 → @ObjectHolder / RegistryObject 形态见该页示例
→ 附魔生效逻辑 → 方法链先核实再写
```

## 本档口径（已核实）

- 注册表 id **`minecraft:enchantment`** 在本档语料逐字在档（concepts_registries:140-142）。
- `Enchantment` 类存在（query_api found）。
- 战利品掉落受 `LootingLevelEvent`（Forge 事件总线）与抢夺附魔叠加影响——见本档 `resources_server_loottables.md:71` 原文。

## 反模式

- 把 1.21 的数据驱动附魔 JSON 套到 1.20.1（本版仍是代码注册面）。
- 凭记忆写效果方法链。

## 下一步

- 语料全文：`get_doc_full`（concepts_registries / resources_server_loottables）；反模式库：`forge/1.20.1/knowledge/antipatterns/`。
