---
title: "RecipeList"
description: "public class RecipeList extends java.lang.Object"
package: "net/minecraft/client/gui/recipebook"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/recipebook/RecipeList.html"
sourceType: javadoc
---

# RecipeList

**Inheritance:** java.lang.Object → net.minecraft.client.gui.recipebook.RecipeList

## Class signature

```java
public class RecipeList extends java.lang.Object
```

## Constructors

- `RecipeList()`

## Methods

- `void add(IRecipe recipe)`
- `void canCraft(RecipeItemHelper handler, int width, int height, RecipeBook book)`
- `boolean containsCraftableRecipes()`
- `boolean containsValidRecipes()`
- `java.util.List<IRecipe> getDisplayRecipes(boolean onlyCraftable)`
- `java.util.List<IRecipe> getRecipes()`
- `java.util.List<IRecipe> getRecipes(boolean p_194208_1_)`
- `boolean hasSingleResultItem()`
- `boolean isCraftable(IRecipe recipe)`
- `boolean isNotEmpty()`
- `void updateKnownRecipes(RecipeBook book)`
