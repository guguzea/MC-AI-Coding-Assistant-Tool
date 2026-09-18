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