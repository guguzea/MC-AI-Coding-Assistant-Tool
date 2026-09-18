---
title: "ItemShears"
description: "Called before a block is broken."
package: "net/minecraft/item"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/item/ItemShears.html"
sourceType: javadoc
---

# ItemShears

## Class signature

```java
public class ItemShears extends Item
```

## Constructors

- `public ItemShears()`

## Methods

- `public boolean onBlockDestroyed( ItemStack stack, World worldIn, IBlockState state, BlockPos pos, EntityLivingBase entityLiving)`
- `public boolean canHarvestBlock( IBlockState blockIn)`
- `public float getStrVsBlock( ItemStack stack, IBlockState state)`
- `public boolean itemInteractionForEntity( ItemStack itemstack, EntityPlayer player, EntityLivingBase entity, EnumHand hand)`
- `public boolean onBlockStartBreak( ItemStack itemstack, BlockPos pos, EntityPlayer player)`

## Description

Called before a block is broken.
