---
name: mc-enchantment
description: 附魔注册与效果。触发词：Enchantment、Enchantments
platform: fabric
version: "1.21.4"
dependencies: []
mappings: yarn
---

# mc-enchantment（1.21.4）

> 一手来源：本档 docs 语料 `data/fabric_1.21.4/fabric-docs/1.21.4/processed/develop_items_custom-enchantment-effects.md`（原文：「Starting from version 1.21, custom enchantments in Minecraft use a "data-driven" approach」——附魔拆解为 effect components，默认效果含 item damage / knockback / experience）。

## Decision Flow

```
→ 简单附魔（属性加成类）→ 数据驱动：注册表 JSON + 默认 effect components
→ 默认效果不够 → 自定义 enchantment effect（语料专页 + 代码面）
→ 效果组件清单 → Minecraft Wiki《Enchantment definition#Effect components》（语料页原文给出的链接）
→ 类名核实 → search_fabric_docs(version=1.21.4) / convert_mapping（to=yarn）
```

## 本档口径（已核实）

- **1.21 起附魔是数据驱动的**（语料专页原文）；效果被拆成 effect components，默认支持伤害/击退/经验等。
- 复杂效果需要自定义 effect component（Java 侧）——该页即「Custom Enchantment Effects」教程。
- 默认效果清单以 wiki《Enchantment definition》页为准（语料页引用的官方 wiki 链接）。

## 反模式

- 把 1.20.x 的纯代码注册附魔写法套到 1.21（两代机制）。
- effect 组件名凭记忆写（先查语料专页 / wiki）。

## 下一步

- 语料全文：`get_doc_full`（develop_items_custom-enchantment-effects，version=1.21.4）；数据面：`mc-datapack`。
