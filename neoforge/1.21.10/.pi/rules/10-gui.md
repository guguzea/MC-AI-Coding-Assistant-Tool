---
description: 10 — GUI（NeoForge 1.21.10）
---

# 10 — GUI（NeoForge 1.21.10）

来源（官方原文）：
- https://docs.neoforged.net/docs/1.21.10/inventories/container/
- https://docs.neoforged.net/docs/1.21.10/rendering/screens/

本档文档树 **没有** `gui/menus` / `gui/screens`（`get_neoforge_doc_full` `DOC_NOT_FOUND`；线上 `/docs/1.21.10/gui/menus/` 404）。**禁止**把 1.21.5/1.21.8 的 `MenuType` 构造、`IMenuTypeExtension`、`openMenu` / `useWithoutItem` 返回值改版本号冒充。

## 容器（不是完整 MenuType 教程）

- NeoForge 写优先用 `ItemStacksResourceHandler`，`Container` 页主要给原版对照 / 多加载器。
- 方块实体可继承 `BaseContainerBlockEntity`（同时是 `Container`、`MenuProvider`、`Nameable`）：实现 `getItems` / `setItems`、`getDefaultName`、`createMenu(int, Inventory)` 返回 `AbstractContainerMenu`。
- 物品容器用数据组件 `DataComponents.CONTAINER`（`ItemContainerContents`）。直接对 `Container` 改栈的菜单必须 `#copy()`，文档给 `StackCopySlot`。
- 配置屏（不是物品菜单）：`container.registerExtensionPoint(IConfigScreenFactory.class, ConfigurationScreen::new)`，见 https://docs.neoforged.net/docs/1.21.10/misc/config/

## Screen（rendering/screens 本档 DOC_NOT_FOUND，未核实）

- 独立 GUI / 容器 GUI 的 blit、`Matrix3x2fStack`、`RegisterMenuScreensEvent` **未**用本档 `get_neoforge_doc_full` 核到。禁止把邻档 `rendering/screens` 改版本号冒充。改口 `search_neoforge_docs`。
- 额外同步走 06 Payload（`RegisterClientPayloadHandlersEvent` + `ClientPacketDistributor`）。禁止 SimpleChannel。
