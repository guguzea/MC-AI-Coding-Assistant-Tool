---
title: "ItemFishFood"
description: "returns a list of items with the same ID, but different meta (eg: dye returns 16 items)"
package: "net/minecraft/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemFishFood.html"
sourceType: javadoc
---

# ItemFishFood

## Class signature

```java
public class ItemFishFood extends ItemFood
```

## Constructors

- `public ItemFishFood(boolean cooked)`

## Methods

- `public int getHealAmount( ItemStack stack)`
- `public float getSaturationModifier( ItemStack stack)`
- `public java.lang.String getPotionEffect( ItemStack stack)`
- `protected void onFoodEaten( ItemStack stack, World worldIn, EntityPlayer player)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`
- `public java.lang.String getUnlocalizedName( ItemStack stack)`

## Description

returns a list of items with the same ID, but different meta (eg: dye returns 16 items)
