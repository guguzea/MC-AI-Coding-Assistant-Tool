---
title: "ItemDye"
description: "public class ItemDye extends Item"
package: "net/minecraft/item"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/item/ItemDye.html"
sourceType: javadoc
---

# ItemDye

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemDye

## Class signature

```java
public class ItemDye extends Item
```

## Constructors

- `ItemDye()`

## Methods

- `static boolean applyBonemeal(ItemStack stack, World worldIn, BlockPos target)`
- `static boolean applyBonemeal(ItemStack stack, World worldIn, BlockPos target, EntityPlayer player, EnumHand hand)`
- `void getSubItems(CreativeTabs tab, NonNullList<ItemStack> items)`
- `java.lang.String getUnlocalizedName(ItemStack stack)`
- `boolean itemInteractionForEntity(ItemStack stack, EntityPlayer playerIn, EntityLivingBase target, EnumHand hand)`
- `EnumActionResult onItemUse(EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `static void spawnBonemealParticles(World worldIn, BlockPos pos, int amount)`

## Fields

- `static int[] DYE_COLORS`
