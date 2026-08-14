---
description: 10 — GUI（NeoForge 1.20.4）
---

# 10 — GUI（NeoForge 1.20.4）

来源：https://docs.neoforged.net/docs/1.20.4/gui/menus/

- 注册 `MenuType`（`DeferredRegister`），菜单实例不是 registry object。
- `AbstractContainerMenu` + 客户端 `Screen` + `MenuScreens.register`。
- 文档 menus 页示例：NetworkHooks.openScreen；MenuType 可用 IForgeMenuType.create。
- 额外数据同步：DataSlot / ContainerData，或 06 的 Payload。**禁止 SimpleChannel。**

1.20.4 文档出现 `IForgeMenuType.create` 与 `NetworkHooks.openScreen`。更高版本名称可能变，先 `search_neoforge_docs version=1.20.4 query=MenuType`。
