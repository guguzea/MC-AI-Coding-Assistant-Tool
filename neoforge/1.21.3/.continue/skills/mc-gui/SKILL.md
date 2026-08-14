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

来源：https://docs.neoforged.net/docs/1.21.3/gui/menus/

- 注册 `MenuType`（`DeferredRegister`），菜单实例不是 registry object。
- `AbstractContainerMenu` + 客户端 `Screen` + `MenuScreens.register`。
- MenuType DeferredRegister；禁止 Forge IMessage 同步 GUI。
- 额外数据同步：DataSlot / ContainerData，或 06 的 Payload。**禁止 SimpleChannel。**

1.20.4 文档出现 `IForgeMenuType.create` 与 `NetworkHooks.openScreen`。更高版本名称可能变，先 `search_neoforge_docs version=1.21.3 query=MenuType`。

