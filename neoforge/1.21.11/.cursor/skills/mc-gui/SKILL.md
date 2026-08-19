---
name: mc-gui
description: NeoForge 1.21.11 mc-gui。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.11"
dependencies: []
mappings: mojmap
---

# mc-gui（NeoForge 1.21.11）

禁止从 Forge 或邻档复制。1.21.11 文档把 ResourceLocation 换成 Identifier。Primer 26.1 才是下一跳。

# 10 — GUI（NeoForge 1.21.11）

官方 `https://docs.neoforged.net/docs/1.21.11/gui/menus/` 与 `.../gui/screens/` **已 404**（2026-08-19 核）。**禁止**把邻档 gui 页当本档全文。

以本档 loader-api 为准（已核）：

- 注册 `MenuType`（`DeferredRegister`），菜单实例不是 registry object。
- extra data：`IMenuTypeExtension.create(IContainerFactory)`；实例 `create(int, Inventory, RegistryFriendlyByteBuf)`。
- 打开：`IPlayerExtension#openMenu(MenuProvider, BlockPos)` 或 `openMenu(MenuProvider, Consumer<RegistryFriendlyByteBuf>)`。`serverPlayer.openMenu(new SimpleMenuProvider(...))`。带 Consumer 的重载只给 `IContainerFactory` 菜单用。
- Screen：物理客户端、mod bus 上 `RegisterMenuScreensEvent#register(MenuType, MenuScreens.ScreenConstructor)`。**不要**写 `MenuScreens.register`。
- 槽位同步：`DataSlot` / `ContainerData`，或 06 的 Payload。**禁止 SimpleChannel。**
- 资源 id 用 `Identifier.fromNamespaceAndPath`，不要写 `ResourceLocation.fromNamespaceAndPath`。
- loader-api **未收录** `NetworkHooks`。不要抄 1.20.4 的 `NetworkHooks.openScreen` / `IForgeMenuType`。
