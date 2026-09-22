---
title: "ShapelessOreRecipe"
description: "public class ShapelessOreRecipe extends java.lang.Object implements IRecipe"
package: "net/minecraftforge/oredict"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/oredict/ShapelessOreRecipe.html"
sourceType: javadoc
---

# ShapelessOreRecipe

**Inheritance:** java.lang.Object → net.minecraftforge.oredict.ShapelessOreRecipe

## Class signature

```java
public class ShapelessOreRecipe extends java.lang.Object implements IRecipe
```

## Constructors

- `ShapelessOreRecipe(Block result, java.lang.Object... recipe)`
- `ShapelessOreRecipe(Item result, java.lang.Object... recipe)`
- `ShapelessOreRecipe(ItemStack result, java.lang.Object... recipe)`

## Methods

- `ItemStack getCraftingResult(InventoryCrafting var1)`
- `java.util.ArrayList<java.lang.Object> getInput()` — Returns the input for this recipe, any mod accessing this value should never manipulate the values in this array as it will effect the recipe itself.
- `ItemStack getRecipeOutput()`
- `int getRecipeSize()`
- `ItemStack [] getRemainingItems(InventoryCrafting inv)`
- `boolean matches(InventoryCrafting var1, World world)`

## Fields

- `protected java.util.ArrayList<java.lang.Object> input`
- `protected ItemStack output`
