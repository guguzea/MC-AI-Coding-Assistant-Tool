---
description: 07 — DataGen（NeoForge 1.21.5）
---

# 07 — DataGen（NeoForge 1.21.5）

来源：https://docs.neoforged.net/docs/1.21.5/resources/

事件已拆：`GatherDataEvent.Client` / `GatherDataEvent.Server`。Client 可含全部 provider；Server 只含数据包。MDK 默认把全部挂到 Client，任务 `runClientData`。

先 `event.createDatapackRegistryObjects(...)`，再用 `event.createProvider(...)`。另有 `createBlockAndItemTags`。

`RecipeProvider` 本档示例：构造 `(HolderLookup.Provider, RecipeOutput)`，`buildRecipes()` 无参；再套 `RecipeProvider.Runner`。模型走 `ModelProvider`（含 blockstate / client items），不是 1.20.6 的 `BlockStateProvider` + `ItemModelProvider` 那套表。

数据包文件夹名单数：`advancement` / `loot_table` / `recipe`（不是 1.20.6 的 `advancements` / `loot_tables` / `recipes`）。

不要用 1.12 `LanguageRegistry`。不要把未拆分的 `GatherDataEvent` + `generator.addProvider(includeServer(), ...)` 当本档主路径。
