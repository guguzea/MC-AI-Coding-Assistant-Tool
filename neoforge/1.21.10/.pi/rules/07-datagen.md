---
description: 07 — DataGen（NeoForge 1.21.10）
---

# 07 — DataGen（NeoForge 1.21.10）

来源：https://docs.neoforged.net/docs/1.21.10/resources/

`GatherDataEvent.Client` / `GatherDataEvent.Server` 已拆。先 `createDatapackRegistryObjects`，再 `createProvider`。`RecipeProvider.Runner` 用法与 1.21.5 页相同。

相对 1.21.5 资源表多了：客户端 `EquipmentAssetProvider`、`waypoint_style`；服务端 `RecipePrioritiesProvider`、`datapacks`、`dialog` 等文件夹。模型仍走 `ModelProvider`。

不要用未拆分的 `GatherDataEvent` + `includeServer()` 当本档主路径。不要用 1.12 `LanguageRegistry`。
