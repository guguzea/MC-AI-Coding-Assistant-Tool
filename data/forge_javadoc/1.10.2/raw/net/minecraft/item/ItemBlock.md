---
title: "ItemBlock"
description: "public class ItemBlock extends Item"
package: "net/minecraft/item"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/item/ItemBlock.html"
sourceType: javadoc
---

# ItemBlock

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemBlock

## Class signature

```java
public class ItemBlock extends Item
```

## Constructors

- `ItemBlock(Block block)`

## Methods

- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side, EntityPlayer player, ItemStack stack)`
- `Block getBlock()`
- `CreativeTabs getCreativeTab()`
- `void getSubItems(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> subItems)`
- `java.lang.String getUnlocalizedName()`
- `java.lang.String getUnlocalizedName(ItemStack stack)`
- `EnumActionResult onItemUse(ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `boolean placeBlockAt(ItemStack stack, EntityPlayer player, World world, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ, IBlockState newState)` — Called to actually place the block, after the location is determined and all permission checks have been made.
- `static boolean setTileEntityNBT(World worldIn, EntityPlayer player, BlockPos pos, ItemStack stackIn)`
- `ItemBlock setUnlocalizedName(java.lang.String unlocalizedName)`

## Fields

- `Block block`
