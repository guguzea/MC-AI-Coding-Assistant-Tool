---
description: 07 — DataGen（NeoForge 1.20.6）
---

# 07 — DataGen（NeoForge 1.20.6）

来源：https://docs.neoforged.net/docs/1.20.6/resources/

事件：**`GatherDataEvent`（尚未拆成 Client/Server 子类）**。

```java
@SubscribeEvent // mod event bus
public static void gatherData(GatherDataEvent event) {
    DataGenerator generator = event.getGenerator();
    PackOutput output = generator.getPackOutput();
    ExistingFileHelper existingFileHelper = event.getExistingFileHelper();
    CompletableFuture<HolderLookup.Provider> lookupProvider = event.getLookupProvider();
    generator.addProvider(event.includeServer(), new MyRecipeProvider(output, lookupProvider));
}
```

`RecipeProvider` 构造：`PackOutput` + `CompletableFuture<HolderLookup.Provider>`，`buildRecipes(RecipeOutput)`。语言走 `LanguageProvider`。客户端 provider 用 `event.includeClient()`。

不要用 1.12 `LanguageRegistry`。不要把 1.21.5 的 `GatherDataEvent.Client` / `createProvider` / `RecipeProvider.Runner` 抄进本档。
