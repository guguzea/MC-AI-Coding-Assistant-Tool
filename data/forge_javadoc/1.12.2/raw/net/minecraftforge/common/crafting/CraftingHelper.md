---
title: "CraftingHelper"
description: "public class CraftingHelper extends java.lang.Object"
package: "net/minecraftforge/common/crafting"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/crafting/CraftingHelper.html"
sourceType: javadoc
---

# CraftingHelper

**Inheritance:** java.lang.Object → net.minecraftforge.common.crafting.CraftingHelper

## Class signature

```java
public class CraftingHelper extends java.lang.Object
```

## Constructors

- `CraftingHelper()`

## Methods

- `@Deprecated static boolean findFiles(ModContainer mod, java.lang.String base, java.util.function.Function<java.nio.file.Path, java.lang.Boolean> preprocessor, java.util.function.BiFunction<java.nio.file.Path, java.nio.file.Path, java.lang.Boolean> processor)` — Deprecated. Use findFiles(ModContainer, String, Function, BiFunction, boolean, boolean) instead.
- `@Deprecated static boolean findFiles(ModContainer mod, java.lang.String base, java.util.function.Function<java.nio.file.Path, java.lang.Boolean> preprocessor, java.util.function.BiFunction<java.nio.file.Path, java.nio.file.Path, java.lang.Boolean> processor, boolean defaultUnfoundRoot)` — Deprecated. Use findFiles(ModContainer, String, Function, BiFunction, boolean, boolean) instead.
- `static boolean findFiles(ModContainer mod, java.lang.String base, java.util.function.Function<java.nio.file.Path, java.lang.Boolean> preprocessor, java.util.function.BiFunction<java.nio.file.Path, java.nio.file.Path, java.lang.Boolean> processor, boolean defaultUnfoundRoot, boolean visitAllFiles)`
- `static java.util.function.BooleanSupplier getCondition(JsonObject json, JsonContext context)`
- `static Ingredient getIngredient(JsonElement json, JsonContext context)`
- `static Ingredient getIngredient(java.lang.Object obj)`
- `static ItemStack getItemStack(JsonObject json, JsonContext context)`
- `static ItemStack getItemStackBasic(JsonObject json, JsonContext context)`
- `static IRecipe getRecipe(JsonObject json, JsonContext context)`
- `static void init()`
- `static JsonContext loadContext(ResourceLocation path)`
- `static JsonContext loadContext(ResourceLocation path, ModContainer mod)`
- `static void loadFactories(ModContainer mod, java.lang.String base, CraftingHelper.FactoryLoader ... loaders)`
- `static void loadRecipes(boolean revertFrozen)`
- `static CraftingHelper.ShapedPrimer parseShaped(java.lang.Object... recipe)`
- `static boolean processConditions(JsonArray conditions, JsonContext context)`
- `static boolean processConditions(JsonObject json, java.lang.String memberName, JsonContext context)`
- `static void register(ResourceLocation key, IConditionFactory factory)`
- `static void register(ResourceLocation key, IIngredientFactory factory)`
- `static void register(ResourceLocation key, IRecipeFactory factory)`

## Fields

- `static CraftingHelper.FactoryLoader<IConditionFactory> CONDITIONS`
- `static Gson GSON`
- `static CraftingHelper.FactoryLoader<IIngredientFactory> INGREDIENTS`
- `static CraftingHelper.FactoryLoader<IRecipeFactory> RECIPES`
