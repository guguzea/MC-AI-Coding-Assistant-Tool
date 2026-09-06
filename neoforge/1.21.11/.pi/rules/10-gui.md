---
description: 10 — GUI（NeoForge 1.21.11）
---

# 10 — GUI（NeoForge 1.21.11）

官方 `https://docs.neoforged.net/docs/1.21.11/gui/menus/` 与 `.../gui/screens/` **已 404**（2026-08-19 核）。**禁止**把邻档 gui 页当本档全文，也禁止编造本档专页。
> ⚠️ 离线数据缺口：本档 data/neoforge_1.21.11/ 未入库 gui/screens、gui/menus 页，search_neoforge_docs 查不到；上述来源以线上版为准（禁止从邻版复制补索引）。

以本档 loader-api 为准（已核）：

- 注册 `MenuType`（`DeferredRegister`），菜单实例不是 registry object。
- extra data：`IMenuTypeExtension.create(IContainerFactory)`；实例 `create(int, Inventory, RegistryFriendlyByteBuf)`。
- 打开：`IPlayerExtension#openMenu(MenuProvider, BlockPos)` 或 `openMenu(MenuProvider, Consumer<RegistryFriendlyByteBuf>)`。示例写法与 1.21.8 官方页相同意图：`serverPlayer.openMenu(new SimpleMenuProvider(...))`。带 Consumer 的重载只给 `IContainerFactory` 菜单用。
- Screen：物理客户端、mod bus 上 `RegisterMenuScreensEvent#register(MenuType, MenuScreens.ScreenConstructor)`。**不要**写 `MenuScreens.register`。
- 槽位同步：`DataSlot` / `ContainerData`，或 06 的 Payload。**禁止 SimpleChannel。**
- 资源 id 用 `Identifier.fromNamespaceAndPath`（本档文档已换名），不要写 `ResourceLocation.fromNamespaceAndPath`。
- loader-api **未收录** `NetworkHooks`。不要抄 1.20.4 的 `NetworkHooks.openScreen` / `IForgeMenuType`。
