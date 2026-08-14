---
name: mc-gui
description: NeoForge 1.21.1 mc-gui。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.1"
dependencies: []
mappings: mojmap
---

# mc-gui（NeoForge 1.21.1）

禁止从 Forge 或邻档复制。1.21.1 起事件名变成复数 Handlers。payload 用 CustomPacketPayload.Type + StreamCodec + playBidirectional/ToClient/ToServer。

# 10 — GUI（NeoForge 1.21.1）

来源：https://docs.neoforged.net/docs/1.21.1/gui/menus/

- 注册 `MenuType`（`DeferredRegister`），菜单实例不是 registry object。
- `AbstractContainerMenu` + 客户端 `Screen` + `MenuScreens.register`。
- MenuType + AbstractContainerMenu；槽位同步不要用 SimpleChannel。打开菜单以该版 gui/menus 文档为准。
- 额外数据同步：DataSlot / ContainerData，或 06 的 Payload。**禁止 SimpleChannel。**

1.20.4 文档出现 `IForgeMenuType.create` 与 `NetworkHooks.openScreen`。更高版本名称可能变，先 `search_neoforge_docs version=1.21.1 query=MenuType`。

