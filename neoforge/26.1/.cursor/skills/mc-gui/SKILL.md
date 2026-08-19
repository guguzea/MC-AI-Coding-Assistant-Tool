---
name: mc-gui
description: NeoForge 26.1 mc-gui。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "26.1"
dependencies: []
mappings: mojmap
---

# mc-gui（NeoForge 26.1）

禁止从 Forge 或邻档复制。26.1 是独立档：Java 25、去混淆、ModContainer 构造参数、GatherDataEvent 拆分。官方 /docs/26.2/ 仍 404，禁止克隆本档冒充 26.2。

# 10 — GUI（NeoForge 26.1）

官方 `https://docs.neoforged.net/docs/gui/menus/` **已 404**（2026-08-19 核）。本档 data **没有** `gui/menus` / `gui/screens` 入库页。已入库相关页：`inventories/container`。

以本档 loader-api 为准（已核）：

- 注册 `MenuType`（`DeferredRegister`），菜单实例不是 registry object。
- extra data：`IMenuTypeExtension.create(IContainerFactory)`；实例 `create(int, Inventory, RegistryFriendlyByteBuf)`。
- 打开：`IPlayerExtension#openMenu(MenuProvider, BlockPos)` 或 `openMenu(MenuProvider, Consumer<RegistryFriendlyByteBuf>)`。`serverPlayer.openMenu(new SimpleMenuProvider(...))`。带 Consumer 的重载只给 `IContainerFactory` 菜单用。
- Screen：物理客户端、mod bus 上 `RegisterMenuScreensEvent#register(MenuType, MenuScreens.ScreenConstructor)`。**不要**写 `MenuScreens.register`。
- 容器实现优先官方 `inventories/container`：`ItemStackHandler`、`BaseContainerBlockEntity`、物品容器用 `DataComponents.CONTAINER` + `StackCopySlot`。
- 槽位同步：`DataSlot` / `ContainerData`，或 06 的 Payload。**禁止 SimpleChannel。**
- Java **25**；不要抄 1.20.4 的 `NetworkHooks.openScreen` / `IForgeMenuType`。
