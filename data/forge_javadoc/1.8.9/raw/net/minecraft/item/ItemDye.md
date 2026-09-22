---
title: "ItemDye"
description: "public class ItemDye extends Item"
package: "net/minecraft/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemDye.html"
sourceType: javadoc
---

# ItemDye

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemDye

## Class signature

```java
public class ItemDye extends Item
```

## Constructors

- `ItemDye()`

## Methods

- `static boolean applyBonemeal(ItemStack stack, World worldIn, BlockPos target)`
- `static boolean applyBonemeal(ItemStack stack, World worldIn, BlockPos target, EntityPlayer player)`
- `void getSubItems(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> subItems)` — returns a list of items with the same ID, but different meta (eg: dye returns 16 items)
- `java.lang.String getUnlocalizedName(ItemStack stack)` — Returns the unlocalized name of this item.
- `boolean itemInteractionForEntity(ItemStack stack, EntityPlayer playerIn, EntityLivingBase target)` — Returns true if the item can be used on the given entity, e.g. shears on sheep.
- `boolean onItemUse(ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)` — Called when a Block is right-clicked with this Item
- `static void spawnBonemealParticles(World worldIn, BlockPos pos, int amount)`

## Fields

- `static int[] dyeColors`
