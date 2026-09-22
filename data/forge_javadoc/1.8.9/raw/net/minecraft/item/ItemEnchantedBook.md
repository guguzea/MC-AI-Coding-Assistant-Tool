---
title: "ItemEnchantedBook"
description: "public class ItemEnchantedBook extends Item"
package: "net/minecraft/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemEnchantedBook.html"
sourceType: javadoc
---

# ItemEnchantedBook

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemEnchantedBook

## Class signature

```java
public class ItemEnchantedBook extends Item
```

## Methods

- `void addEnchantment(ItemStack stack, EnchantmentData enchantment)` — Adds an stored enchantment to an enchanted book ItemStack
- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)` — allows items to add custom lines of information to the mouseover description
- `void getAll(Enchantment enchantment, java.util.List<ItemStack> list)`
- `ItemStack getEnchantedItemStack(EnchantmentData data)` — Returns the ItemStack of an enchanted version of this item.
- `NBTTagList getEnchantments(ItemStack stack)`
- `WeightedRandomChestContent getRandom(java.util.Random rand)`
- `WeightedRandomChestContent getRandom(java.util.Random rand, int minChance, int maxChance, int weight)`
- `EnumRarity getRarity(ItemStack stack)` — Return an item rarity from EnumRarity
- `boolean hasEffect(ItemStack stack)`
- `boolean isItemTool(ItemStack stack)` — Checks isDamagable and if it cannot be stacked

## Fields

- `ItemEnchantedBook`
