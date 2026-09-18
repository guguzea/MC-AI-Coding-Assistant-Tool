---
title: "IMerchant"
description: "public interface IMerchant"
package: "net/minecraft/entity"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/IMerchant.html"
sourceType: javadoc
---

# IMerchant

## Class signature

```java
public interface IMerchant
```

## Methods

- `void setCustomer( EntityPlayer player)`
- `EntityPlayer getCustomer()`
- `@Nullable MerchantRecipeList getRecipes( EntityPlayer player)`
- `void setRecipes(@Nullable MerchantRecipeList recipeList)`
- `void useRecipe( MerchantRecipe recipe)`
- `void verifySellingItem( ItemStack stack)`
- `ITextComponent getDisplayName()`
- `World getWorld()`
- `BlockPos getPos()`
