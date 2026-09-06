---
description: 10 — GUI（NeoForge 1.21.8）
---

# 10 — GUI（NeoForge 1.21.8）

来源（官方原文）：
- https://docs.neoforged.net/docs/1.21.8/gui/menus/
- https://docs.neoforged.net/docs/1.21.8/gui/screens/
> ⚠️ 离线数据缺口：本档 data/neoforge_1.21.8/ 未入库 gui/screens、gui/menus 页，search_neoforge_docs 查不到；上述来源以线上版为准（禁止从邻版复制补索引）。

- 注册 `MenuType`（`DeferredRegister`），菜单实例不是 registry object。
- 无 extra data：官方示例 `new MenuType<>(MyMenu::new, FeatureFlags.DEFAULT_FLAGS)`。
- extra data：`IMenuTypeExtension.create(...)`。**不是** `IForgeMenuType`。
- 打开：逻辑服务端 `IPlayerExtension#openMenu`。官方示例 `serverPlayer.openMenu(new SimpleMenuProvider((id, inv, player) -> new MyMenu(id, inv, /* server params */), Component.translatable(...)))`。带 extra 的 `Consumer` 只给 `IContainerFactory` 菜单用。
- Screen：物理客户端、mod bus 上 `RegisterMenuScreensEvent`：`event.register(MY_MENU.get(), MyContainerScreen::new)`。**不要**写 `MenuScreens.register`。
- 槽位：官方示例可用 `addStandardInventorySlots(playerInventory, 8, 84)`；数据槽用 `SlotItemHandler` / `ItemStackHandler`。整数同步：`DataSlot` / `ContainerData`。额外自定义走 06 Payload。**禁止 SimpleChannel。**
- 方块：官方示例 `getMenuProvider` + `useWithoutItem` 里 `serverPlayer.openMenu(...)`，返回 `InteractionResult.SUCCESS`。
- DataGen（`GatherDataEvent.Client` / `Server`、`createProvider`）与菜单类分家，不要把 DataGen 事件写进 Screen。
- loader-api **未收录** `NetworkHooks`。不要抄 1.20.4 的 `NetworkHooks.openScreen`。
