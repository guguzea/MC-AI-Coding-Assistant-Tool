---
name: mc-enchantment
description: 附魔注册与效果。触发词：Enchantment、Enchantments
platform: forge
version: "1.16.5"
dependencies: []
mappings: mcp
---

# mc-enchantment（1.16.5）

> 一手来源：类名 `Enchantment` 经 `query_api`（version=1.16.5）核实存在；注册表 id 的一手条目（`"minecraft:enchantment"` 形态）见本档语料 `concepts_registries.md` 的 @ObjectHolder 示例体系。

## Decision Flow

```
→ 自定义附魔 → Enchantment 子类（query_api 已钉）
→ 注册 → 注册表体系见本档 concepts_registries 页（ Forge 注册表规则、@ObjectHolder 引用形态）
→ 附魔生效逻辑 → 方法链先 get_method_params / 反编译核实
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- `Enchantment` 在本档存在（query_api found）。
- `minecraft:enchantment` 注册表 id 形态与 @ObjectHolder 引用规则见本档 `concepts_registries` 页（该页 1.20.1 版有逐字 `@ObjectHolder(registryName = "minecraft:enchantment", ...)` 条目；1.16.5 版该页同为注册表权威页，引用前先翻档内原文）。

## 反模式

- 附魔走数据包 JSON（1.16 时代附魔仍是代码注册——数据驱动是 1.21 起，见 fabric 档）。
- 凭记忆写效果方法链。

## 下一步

- 语料全文：`get_doc_full`（concepts_registries）；反模式库：`forge/1.16.5/knowledge/antipatterns/`。
