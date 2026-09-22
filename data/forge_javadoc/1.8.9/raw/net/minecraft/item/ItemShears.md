---
title: "ItemShears"
description: "public class ItemShears extends Item"
package: "net/minecraft/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemShears.html"
sourceType: javadoc
---

# ItemShears

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemShears

## Class signature

```java
public class ItemShears extends Item
```

## Methods

- `boolean canHarvestBlock(Block blockIn)` — Check whether this Item can harvest the given Block
- `float getStrVsBlock(ItemStack stack, Block block)`
- `boolean itemInteractionForEntity(ItemStack itemstack, EntityPlayer player, EntityLivingBase entity)` — Returns true if the item can be used on the given entity, e.g. shears on sheep.
- `boolean onBlockDestroyed(ItemStack stack, World worldIn, Block blockIn, BlockPos pos, EntityLivingBase playerIn)` — Called when a Block is destroyed using this Item.
- `boolean onBlockStartBreak(ItemStack itemstack, BlockPos pos, EntityPlayer player)` — Called before a block is broken.

## Fields

- `ItemShears`
