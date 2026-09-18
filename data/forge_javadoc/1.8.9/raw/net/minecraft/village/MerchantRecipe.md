---
title: "MerchantRecipe"
description: "Compensates toolUses with maxTradeUses"
package: "net/minecraft/village"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/village/MerchantRecipe.html"
sourceType: javadoc
---

# MerchantRecipe

## Class signature

```java
public class MerchantRecipe extends java.lang.Object
```

## Constructors

- `public MerchantRecipe( NBTTagCompound tagCompound)`
- `public MerchantRecipe( ItemStack buy1, ItemStack buy2, ItemStack sell)`
- `public MerchantRecipe( ItemStack buy1, ItemStack buy2, ItemStack sell, int toolUsesIn, int maxTradeUsesIn)`
- `public MerchantRecipe( ItemStack buy1, ItemStack sell)`
- `public MerchantRecipe( ItemStack buy1, Item sellItem)`

## Methods

- `public ItemStack getItemToBuy()`
- `public ItemStack getSecondItemToBuy()`
- `public boolean hasSecondItemToBuy()`
- `public ItemStack getItemToSell()`
- `public int getToolUses()`
- `public int getMaxTradeUses()`
- `public void incrementToolUses()`
- `public void increaseMaxTradeUses(int increment)`
- `public boolean isRecipeDisabled()`
- `public void compensateToolUses()`
- `public boolean getRewardsExp()`
- `public void readFromTags( NBTTagCompound tagCompound)`
- `public NBTTagCompound writeToTags()`

## Description

Compensates toolUses with maxTradeUses
