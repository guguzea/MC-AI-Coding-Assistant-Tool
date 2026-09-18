---
title: "CraftingHelper"
description: "Deprecated. Use findFiles(ModContainer, String, Function, BiFunction, boolean, boolean) instead."
package: "net/minecraftforge/common/crafting"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/crafting/CraftingHelper.html"
sourceType: javadoc
---

# CraftingHelper

## Class signature

```java
public class CraftingHelper extends java.lang.Object
```

## Constructors

- `public CraftingHelper()`

## Methods

- `public static void register( ResourceLocation key, IConditionFactory factory)`
- `public static void register( ResourceLocation key, IRecipeFactory factory)`
- `public static void register( ResourceLocation key, IIngredientFactory factory)`
- `public static Ingredient getIngredient(java.lang.Object obj)`
- `public static Ingredient getIngredient(JsonElement json, JsonContext context)`
- `public static ItemStack getItemStack(JsonObject json, JsonContext context)`
- `public static ItemStack getItemStackBasic(JsonObject json, JsonContext context)`
- `public static CraftingHelper.ShapedPrimer parseShaped(java.lang.Object... recipe)`
- `public static boolean processConditions(JsonObject json, java.lang.String memberName, JsonContext context)`
- `public static boolean processConditions(JsonArray conditions, JsonContext context)`
- `public static java.util.function.BooleanSupplier getCondition(JsonObject json, JsonContext context)`
- `public static IRecipe getRecipe(JsonObject json, JsonContext context)`
- `public static void init()`
- `public static void loadRecipes(boolean revertFrozen)`
- `public static void loadFactories( ModContainer mod, java.lang.String base, CraftingHelper.FactoryLoader ... loaders)`
- `@Deprecated public static boolean findFiles( ModContainer mod, java.lang.String base, java.util.function.Function<java.nio.file.Path,java.lang.Boolean> preprocessor, java.util.function.BiFunction<java.nio.file.Path,java.nio.file.Path,java.lang.Boolean> processor)`
- `@Deprecated public static boolean findFiles( ModContainer mod, java.lang.String base, java.util.function.Function<java.nio.file.Path,java.lang.Boolean> preprocessor, java.util.function.BiFunction<java.nio.file.Path,java.nio.file.Path,java.lang.Boolean> processor, boolean defaultUnfoundRoot)`
- `public static boolean findFiles( ModContainer mod, java.lang.String base, java.util.function.Function<java.nio.file.Path,java.lang.Boolean> preprocessor, java.util.function.BiFunction<java.nio.file.Path,java.nio.file.Path,java.lang.Boolean> processor, boolean defaultUnfoundRoot, boolean visitAllFiles)`
- `public static JsonContext loadContext( ResourceLocation path) throws java.io.IOException`
- `public static JsonContext loadContext( ResourceLocation path, ModContainer mod) throws java.io.IOException`

## Description

Deprecated. Use findFiles(ModContainer, String, Function, BiFunction, boolean, boolean) instead.
