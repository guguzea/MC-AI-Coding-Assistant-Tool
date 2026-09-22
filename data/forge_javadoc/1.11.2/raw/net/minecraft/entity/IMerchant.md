---
title: "IMerchant"
description: "public interface IMerchant"
package: "net/minecraft/entity"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/IMerchant.html"
sourceType: javadoc
---

# IMerchant

## Class signature

```java
public interface IMerchant
```

## Methods

- `EntityPlayer getCustomer()`
- `ITextComponent getDisplayName()`
- `BlockPos getPos()`
- `MerchantRecipeList getRecipes(EntityPlayer player)`
- `World getWorld()`
- `void setCustomer(EntityPlayer player)`
- `void setRecipes(MerchantRecipeList recipeList)`
- `void useRecipe(MerchantRecipe recipe)`
- `void verifySellingItem(ItemStack stack)`
