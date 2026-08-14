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

来源：https://docs.neoforged.net/docs/1.21.11/gui/menus/

- 注册 `MenuType`（`DeferredRegister`），菜单实例不是 registry object。
- `AbstractContainerMenu` + 客户端 `Screen` + `MenuScreens.register`。
- MenuType；打开方式查 1.21.11 gui 文档。
- 额外数据同步：DataSlot / ContainerData，或 06 的 Payload。**禁止 SimpleChannel。**

1.20.4 文档出现 `IForgeMenuType.create` 与 `NetworkHooks.openScreen`。更高版本名称可能变，先 `search_neoforge_docs version=1.21.11 query=MenuType`。

