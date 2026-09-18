---
title: "ItemMonsterPlacer"
description: "returns a list of items with the same ID, but different meta (eg: dye returns 16 items)"
package: "net/minecraft/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemMonsterPlacer.html"
sourceType: javadoc
---

# ItemMonsterPlacer

## Class signature

```java
public class ItemMonsterPlacer extends Item
```

## Constructors

- `public ItemMonsterPlacer()`

## Methods

- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public int getColorFromItemStack( ItemStack stack, int renderPass)`
- `public boolean onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public ItemStack onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)`
- `@Deprecated public static Entity spawnCreature( World worldIn, int entityID, double x, double y, double z)`
- `public static Entity spawnCreature( World worldIn, java.lang.String name, double x, double y, double z)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`
- `public static java.lang.String getEntityName( ItemStack stack)`

## Description

returns a list of items with the same ID, but different meta (eg: dye returns 16 items)
