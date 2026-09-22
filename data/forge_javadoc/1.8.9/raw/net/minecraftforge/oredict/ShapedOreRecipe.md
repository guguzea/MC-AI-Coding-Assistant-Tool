---
title: "ShapedOreRecipe"
description: "public class ShapedOreRecipe extends java.lang.Object implements IRecipe"
package: "net/minecraftforge/oredict"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/oredict/ShapedOreRecipe.html"
sourceType: javadoc
---

# ShapedOreRecipe

**Inheritance:** java.lang.Object → net.minecraftforge.oredict.ShapedOreRecipe

## Class signature

```java
public class ShapedOreRecipe extends java.lang.Object implements IRecipe
```

## Constructors

- `ShapedOreRecipe(Block result, java.lang.Object... recipe)`
- `ShapedOreRecipe(Item result, java.lang.Object... recipe)`
- `ShapedOreRecipe(ItemStack result, java.lang.Object... recipe)`

## Methods

- `protected boolean checkMatch(InventoryCrafting inv, int startX, int startY, boolean mirror)`
- `ItemStack getCraftingResult(InventoryCrafting var1)` — Returns an Item that is the result of this recipe
- `java.lang.Object[] getInput()` — Returns the input for this recipe, any mod accessing this value should never manipulate the values in this array as it will effect the recipe itself.
- `ItemStack getRecipeOutput()`
- `int getRecipeSize()` — Returns the size of the recipe area
- `ItemStack [] getRemainingItems(InventoryCrafting inv)`
- `boolean matches(InventoryCrafting inv, World world)` — Used to check if a recipe matches current crafting inventory
- `ShapedOreRecipe setMirrored(boolean mirror)`

## Fields

- `protected int height`
- `protected java.lang.Object[] input`
- `static int MAX_CRAFT_GRID_HEIGHT`
- `static int MAX_CRAFT_GRID_WIDTH`
- `protected boolean mirrored`
- `protected ItemStack output`
- `protected int width`
