---
title: "IMerchant.html#getRecipes-net.minecraft.entity.player.EntityPlayer-"
description: "public interface IMerchant"
package: "net/minecraftforge/event/village"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/IMerchant.html#getRecipes-net.minecraft.entity.player.EntityPlayer-"
sourceType: javadoc
---

# IMerchant.html#getRecipes-net.minecraft.entity.player.EntityPlayer-

## Class signature

```java
public interface IMerchant
```

## Methods

- `void setCustomer( EntityPlayer player)`
- `EntityPlayer getCustomer()`
- `MerchantRecipeList getRecipes( EntityPlayer player)`
- `void setRecipes( MerchantRecipeList recipeList)`
- `void useRecipe( MerchantRecipe recipe)`
- `void verifySellingItem( ItemStack stack)`
- `ITextComponent getDisplayName()`
- `World getWorld()`
- `BlockPos getPos()`
