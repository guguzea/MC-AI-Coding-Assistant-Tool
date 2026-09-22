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

- `void compensateToolUses()` — Compensates toolUses with maxTradeUses
- `ItemStack getItemToBuy()` — Gets the itemToBuy.
- `ItemStack getItemToSell()` — Gets itemToSell.
- `int getMaxTradeUses()`
- `boolean getRewardsExp()`
- `ItemStack getSecondItemToBuy()` — Gets secondItemToBuy.
- `int getToolUses()`
- `boolean hasSecondItemToBuy()` — Gets if Villager has secondItemToBuy.
- `void increaseMaxTradeUses(int increment)`
- `void incrementToolUses()`
- `boolean isRecipeDisabled()`
- `void readFromTags(NBTTagCompound tagCompound)`
- `NBTTagCompound writeToTags()`