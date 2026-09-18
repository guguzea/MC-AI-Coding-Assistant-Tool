---
title: "ItemEnchantedBook"
description: "Adds an stored enchantment to an enchanted book ItemStack"
package: "net/minecraft/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemEnchantedBook.html"
sourceType: javadoc
---

# ItemEnchantedBook

## Class signature

```java
public class ItemEnchantedBook extends Item
```

## Constructors

- `public ItemEnchantedBook()`

## Methods

- `public boolean hasEffect( ItemStack stack)`
- `public boolean isItemTool( ItemStack stack)`
- `public EnumRarity getRarity( ItemStack stack)`
- `public NBTTagList getEnchantments( ItemStack stack)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `public void addEnchantment( ItemStack stack, EnchantmentData enchantment)`
- `public ItemStack getEnchantedItemStack( EnchantmentData data)`
- `public void getAll( Enchantment enchantment, java.util.List< ItemStack > list)`
- `public WeightedRandomChestContent getRandom(java.util.Random rand)`
- `public WeightedRandomChestContent getRandom(java.util.Random rand, int minChance, int maxChance, int weight)`

## Description

Adds an stored enchantment to an enchanted book ItemStack
