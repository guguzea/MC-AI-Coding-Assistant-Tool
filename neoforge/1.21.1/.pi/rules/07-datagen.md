---
description: 07 — DataGen（NeoForge 1.21.1）
---

# 07 — DataGen（NeoForge 1.21.1）

来源：https://docs.neoforged.net/docs/1.21.1/resources/

事件：`GatherDataEvent（尚未拆成 Client/Server 子类）`。


RecipeProvider 构造需要 PackOutput + CompletableFuture<HolderLookup.Provider>。


不要用 1.12 `LanguageRegistry`。语言文件走 `LanguageProvider`。
