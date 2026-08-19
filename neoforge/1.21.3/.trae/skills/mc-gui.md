---
name: mc-gui
description: NeoForge 1.21.3 mc-gui。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.3"
dependencies: []
mappings: mojmap
---

# mc-gui（NeoForge 1.21.3）

禁止从 Forge 或邻档复制。1.21.3 规则树独立存在是为了禁止 Agent 拿 1.20.4 或 1.21.8 顶上。Data Components 已是物品数据主路径。

# 10 — GUI（NeoForge 1.21.3）

来源（官方原文）：
- https://docs.neoforged.net/docs/1.21.3/gui/menus/
- https://docs.neoforged.net/docs/1.21.3/gui/screens/

- 注册 `MenuType`（`DeferredRegister`），菜单实例不是 registry object。
- 无 extra data：官方示例 `new MenuType<>(MyMenu::new, FeatureFlags.DEFAULT_FLAGS)`。
- extra data：`IMenuTypeExtension.create(...)`。**不是** `IForgeMenuType`。
- 打开：逻辑服务端 `IPlayerExtension#openMenu`。官方示例 `serverPlayer.openMenu(new SimpleMenuProvider(...))`。带 extra 的 `Consumer` 只给 `IContainerFactory` 菜单用。
- Screen：物理客户端、mod bus 上 `RegisterMenuScreensEvent`：`event.register(MY_MENU.get(), MyContainerScreen::new)`。该版 screens 页示例是实例方法 `public void registerScreens`（1.21.1 页是 `public static`）；按本档页抄。**不要**写 `MenuScreens.register`。
- 槽位同步：`Slot` / `SlotItemHandler`、`DataSlot` / `ContainerData`；额外自定义走 06 Payload。**禁止 SimpleChannel / Forge IMessage。**
- 方块：官方示例 `getMenuProvider` + `useWithoutItem` 里 `serverPlayer.openMenu(...)`，返回 `InteractionResult.SUCCESS`。
- loader-api **未收录** `NetworkHooks`。不要抄 1.20.4 的 `NetworkHooks.openScreen`。
