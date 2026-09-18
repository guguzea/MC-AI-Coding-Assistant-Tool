---
title: "ItemPotion"
description: "allows items to add custom lines of information to the mouseover description"
package: "net/minecraft/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemPotion.html"
sourceType: javadoc
---

# ItemPotion

## Class signature

```java
public class ItemPotion extends Item
```

## Constructors

- `public ItemPotion()`

## Methods

- `public java.util.List< PotionEffect > getEffects( ItemStack stack)`
- `public java.util.List< PotionEffect > getEffects(int meta)`
- `public ItemStack onItemUseFinish( ItemStack stack, World worldIn, EntityPlayer playerIn)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public ItemStack onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)`
- `public static boolean isSplash(int meta)`
- `public int getColorFromDamage(int meta)`
- `public int getColorFromItemStack( ItemStack stack, int renderPass)`
- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public boolean isEffectInstant(int meta)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `public boolean hasEffect( ItemStack stack)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`

## Description

allows items to add custom lines of information to the mouseover description
