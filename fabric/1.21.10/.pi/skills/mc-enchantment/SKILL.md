---
name: mc-enchantment
description: 附魔注册与效果。触发词：Enchantment、Enchantments
platform: fabric
version: "1.21.10"
dependencies: []
mappings: yarn
---

# mc-enchantment（1.21.10）

> 一手来源：本档 docs 语料 `develop_items_custom-enchantment-effects.md`（同 1.21 系语料：附魔 data-driven，effect components 机制）。

## Decision Flow

```
→ 简单附魔（属性加成类）→ 数据驱动：注册表 JSON + 默认 effect components
→ 默认效果不够 → 自定义 enchantment effect（语料专页 + 代码面）
→ 效果组件清单 → Minecraft Wiki《Enchantment definition#Effect components》（语料页引用链接）
→ 类名核实 → search_fabric_docs(version=1.21.10) / convert_mapping（to=yarn）
```

## 本档口径（已核实）

- 1.21 起附魔是数据驱动的（语料专页原文，1.21.10 延续该机制）。
- 复杂效果走自定义 effect component（Java 侧）。

## 反模式

- 把 1.20.x 的纯代码注册附魔写法套到 1.21.10。
- effect 组件名凭记忆写。

## 下一步

- 语料全文：`get_doc_full`（develop_items_custom-enchantment-effects，version=1.21.10）；数据面：`mc-datapack`。
