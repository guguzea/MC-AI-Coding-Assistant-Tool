---
description: 10 — GUI（NeoForge 1.21.8）
---

# 10 — GUI（NeoForge 1.21.8）

来源：https://docs.neoforged.net/docs/1.21.8/gui/menus/

- 注册 `MenuType`（`DeferredRegister`），菜单实例不是 registry object。
- `AbstractContainerMenu` + 客户端 `Screen` + `MenuScreens.register`。
- createProvider 风格 DataGen 与菜单分家；GUI 类名查 gui/menus。
- 额外数据同步：DataSlot / ContainerData，或 06 的 Payload。**禁止 SimpleChannel。**

1.20.4 文档出现 `IForgeMenuType.create` 与 `NetworkHooks.openScreen`。更高版本名称可能变，先 `search_neoforge_docs version=1.21.8 query=MenuType`。
