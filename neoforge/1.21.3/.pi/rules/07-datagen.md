---
description: 07 — DataGen（NeoForge 1.21.3）
---

# 07 — DataGen（NeoForge 1.21.3）

来源：https://docs.neoforged.net/docs/1.21.3/resources/

事件：`GatherDataEvent`。


RecipeProvider 构造需要 PackOutput + CompletableFuture<HolderLookup.Provider>。


不要用 1.12 `LanguageRegistry`。语言文件走 `LanguageProvider`。
