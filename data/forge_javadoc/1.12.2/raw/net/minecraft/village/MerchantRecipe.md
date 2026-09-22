---
title: "MerchantRecipe"
description: "public class MerchantRecipe extends java.lang.Object"
package: "net/minecraft/village"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/village/MerchantRecipe.html"
sourceType: javadoc
---

# MerchantRecipe

**Inheritance:** java.lang.Object → net.minecraft.village.MerchantRecipe

## Class signature

```java
public class MerchantRecipe extends java.lang.Object
```

## Constructors

- `MerchantRecipe(ItemStack buy1, Item sellItem)`
- `MerchantRecipe(ItemStack buy1, ItemStack sell)`
- `MerchantRecipe(ItemStack buy1, ItemStack buy2, ItemStack sell)`
- `MerchantRecipe(ItemStack buy1, ItemStack buy2, ItemStack sell, int toolUsesIn, int maxTradeUsesIn)`
- `MerchantRecipe(NBTTagCompound tagCompound)`

## Methods

- `void compensateToolUses()`
- `ItemStack getItemToBuy()`
- `ItemStack getItemToSell()`
- `int getMaxTradeUses()`
- `boolean getRewardsExp()`
- `ItemStack getSecondItemToBuy()`
- `int getToolUses()`
- `boolean hasSecondItemToBuy()`
- `void increaseMaxTradeUses(int increment)`
- `void incrementToolUses()`
- `boolean isRecipeDisabled()`
- `void readFromTags(NBTTagCompound tagCompound)`
- `NBTTagCompound writeToTags()`
