---
id: mcmod-3993/items-registry
title: 物品注册：1.18/1.19 与 1.20 差异
tags: [item, registry, deferredregister, creativetab]
mcHint: 1.18-1.20
---

# 物品注册：版本差异摘要

> 提炼自社区教程；实现以各版本官方 API 与本仓库 rules 为准。

## 1.18.X / 1.19.X（常见写法）

- `Item.Properties().tab(...)` 可直接挂创造页签。
- 仍可见 `RegistryEvent.Register<Item>` + `setRegistryName` 一类写法（较旧）。

## 1.20.X（推荐）

- 使用 `DeferredRegister<Item>` + `RegistryObject`。
- **不要**在 `Item.Properties` 上再 `.tab(...)`；创造页签改为：
  - `DeferredRegister<CreativeModeTab>` 注册 Tab
  - `BuildCreativeModeTabContentsEvent` 的 `event.accept(...)` 放入物品

## 建议

写新模组默认按 **1.20.1 DeferredRegister** 规则（见 `forge/1.20.1/.cursor/rules/01-registry.mdc`）。
