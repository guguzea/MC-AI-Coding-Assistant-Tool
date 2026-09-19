---
name: mc-enchantment
description: 附魔注册与效果。触发词：Enchantment、Enchantments
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# mc-enchantment（1.15.2）

> 一手来源：本档 docs 语料 `data/forge_1.15.2/forge-docs/1.15.2/processed/concepts_registries.md:115`（长行代码例逐字含 `public static final Enchantment flame = null;` 与「To inject: "minecraft:flame" from the [Enchantment] registry」）；同页 :23 显示本档 DeferredRegister 已是 `DeferredRegister.create(ForgeRegistries.BLOCKS, MODID)` 静态工厂形态。

## Decision Flow

```
→ 自定义附魔 → Enchantment 子类（类名在本档语料代码例逐字在档）
→ 注册 → 本档 concepts_registries 页：DeferredRegister.create(...) 静态工厂（:23 原文，非 1.14.4 的 new 形态）
→ 附魔引用 → @ObjectHolder 注入 "minecraft:flame" from the [Enchantment] registry（:115 原文）
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实，均出自本档语料）

- `Enchantment` 类名在 concepts_registries:115 逐字在档。
- 注册体系的 DeferredRegister 形态本档为 `DeferredRegister.create(...)`（:23 原文；与 1.14.4 的 `new DeferredRegister<>(...)` 不同——跨版勿抄）。

## 反模式

- 把 1.14.4 的 `new DeferredRegister<>(...)` 写法照抄到 1.15.2（两档语料形态不同）。
- 凭记忆写效果方法链（本档无一手语料）。

## 下一步

- 语料全文：`get_doc_full`（concepts_registries，version=1.15.2）；反模式库：`forge/1.15.2/knowledge/antipatterns/`。
