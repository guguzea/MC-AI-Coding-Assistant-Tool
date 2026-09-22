---
title: "CraftingManager"
description: "public class CraftingManager extends java.lang.Object"
package: "net/minecraft/item/crafting"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/item/crafting/CraftingManager.html"
sourceType: javadoc
---

# CraftingManager

**Inheritance:** java.lang.Object → net.minecraft.item.crafting.CraftingManager

## Class signature

```java
public class CraftingManager extends java.lang.Object
```

## Constructors

- `CraftingManager()`

## Methods

- `static IRecipe findMatchingRecipe(InventoryCrafting craftMatrix, World worldIn)`
- `static ItemStack findMatchingResult(InventoryCrafting craftMatrix, World worldIn)`
- `@Deprecated static int getIDForRecipe(IRecipe recipe)`
- `static IRecipe getRecipe(ResourceLocation name)`
- `@Deprecated static IRecipe getRecipeById(int id)`
- `static NonNullList<ItemStack> getRemainingItems(InventoryCrafting craftMatrix, World worldIn)`
- `static boolean init()`

## Fields

- `static RegistryNamespaced<ResourceLocation, IRecipe> REGISTRY`
