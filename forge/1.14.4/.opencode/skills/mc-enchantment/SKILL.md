---
name: mc-enchantment
description: 附魔注册与效果。触发词：Enchantment、Enchantments
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# mc-enchantment（1.14.4）

> 一手来源：本档 docs 语料 `data/forge_1.14.4/forge-docs/1.14.4/processed/concepts_registries.md:80-82`（代码例逐字 `public static final Enchantment flame = null;` 与注释「Object to be injected: "minecraft:flame" from the Enchantment registry」）+ `primer_1_14.md:296`（原文「Enchantments are now stored by registry name instead of int id (about time...)」）。

## Decision Flow

```
→ 自定义附魔 → Enchantment 子类（类名在本档语料代码例逐字在档）
→ 注册 → 1.14.4 注册体系见本档 concepts_registries 页（该页示例用 new DeferredRegister<>(ForgeRegistries.BLOCKS, MODID) 旧式构造——enchantments 键的写法以核实为准）
→ 附魔引用 → registry name 形态（1.14 起按注册名存储，不再是 int id——primer 原文）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实，均出自本档语料）

- `Enchantment` 类名在本档 concepts_registries 代码例逐字在档（:80）。
- 1.14 起附魔按**注册名**存储，不再按 int id（primer_1_14:296）。
- `@ObjectHolder` 注入示例（"minecraft:flame" from the Enchantment registry）逐字在档（:82）。

## 反模式

- 按 int id 存储/引用附魔（1.14 已改注册名制，primer 明载）。
- 凭记忆写效果方法链（本档无一手语料）。

## 下一步

- 语料全文：`get_doc_full`（concepts_registries / primer_1_14，version=1.14.4）；反模式库：`forge/1.14.4/knowledge/antipatterns/`。
