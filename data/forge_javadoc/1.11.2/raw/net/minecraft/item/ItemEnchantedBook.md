---
title: "ItemEnchantedBook"
description: "public class ItemEnchantedBook extends Item"
package: "net/minecraft/item"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/item/ItemEnchantedBook.html"
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
- `public boolean isEnchantable( ItemStack stack)`
- `public EnumRarity getRarity( ItemStack stack)`
- `public NBTTagList getEnchantments( ItemStack stack)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `public void addEnchantment( ItemStack stack, EnchantmentData enchantment)`
- `public ItemStack getEnchantedItemStack( EnchantmentData data)`
- `public void getAll( Enchantment enchantment, java.util.List< ItemStack > list)`
