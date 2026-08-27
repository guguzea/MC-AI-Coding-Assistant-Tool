---
description: 10 — GUI（NeoForge 1.20.4）
---

# 10 — GUI（NeoForge 1.20.4）

来源（官方原文）：
- https://docs.neoforged.net/docs/1.20.4/gui/menus/
- https://docs.neoforged.net/docs/1.20.4/gui/screens/

- 注册 `MenuType`（`DeferredRegister`），菜单实例不是 registry object。
- 无 extra data：`new MenuType(MyMenu::new, FeatureFlags.DEFAULT_FLAGS)`。
- extra data：官方 menus 页示例 `IForgeMenuType.create(MyMenu::new)`，客户端构造读 `FriendlyByteBuf extraData`。loader-api 同期类是 `IMenuTypeExtension.create(IContainerFactory)`（extra 也是 `FriendlyByteBuf`）；**不要**把 1.21+ 的 `RegistryFriendlyByteBuf` 抄进本档。
- 打开菜单：官方 menus 页是逻辑服务端 `NetworkHooks.openScreen(serverPlayer, MenuProvider)`；带 extra `FriendlyByteBuf` 的重载只给 `IContainerFactory` 菜单用。`SimpleMenuProvider` 可当 `MenuProvider`。
- Screen：物理客户端、mod bus 上 `RegisterMenuScreensEvent`：`event.register(MY_MENU.get(), MyContainerScreen::new)`（官方 screens 页）。**不要**写 `MenuScreens.register`（NeoForge 已用事件替换该静态方法）。
- 槽位同步：`Slot` / `SlotItemHandler`、`DataSlot` / `ContainerData`；额外自定义走 06 Payload。**禁止 SimpleChannel。**
- 方块：官方示例 `getMenuProvider` + `use` 里 `NetworkHooks.openScreen(serverPlayer, state.getMenuProvider(...))`。

更高版本打开方式改成 `IPlayerExtension#openMenu`，名称以**该版** `search_neoforge_docs` 为准，不要把本档 `NetworkHooks` 抄进 1.21.1+。
