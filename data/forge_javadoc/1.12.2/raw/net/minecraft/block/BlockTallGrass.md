---
title: "BlockTallGrass"
description: "public class BlockTallGrass extends BlockBush implements IGrowable, IShearable"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockTallGrass.html"
sourceType: javadoc
---

# BlockTallGrass

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockTallGrass

## Class signature

```java
public class BlockTallGrass extends BlockBush implements IGrowable, IShearable
```

## Constructors

- `BlockTallGrass()`

## Methods

- `boolean canBlockStay(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canGrow(World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `boolean canUseBonemeal(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `void getDrops(NonNullList<ItemStack> drops, IBlockAccess world, BlockPos pos, IBlockState state, int fortune)` — This gets a complete list of items dropped from this block.
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `Block.EnumOffsetType getOffsetType()`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(CreativeTabs itemIn, NonNullList<ItemStack> items)`
- `void grow(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `boolean isReplaceable(IBlockAccess worldIn, BlockPos pos)`
- `boolean isShearable(ItemStack item, IBlockAccess world, BlockPos pos)` — Checks if the object is currently shearable Example: Sheep return false when they have no wool
- `NonNullList<ItemStack> onSheared(ItemStack item, IBlockAccess world, BlockPos pos, int fortune)` — Performs the shear function on this object.
- `int quantityDroppedWithBonus(int fortune, java.util.Random random)`

## Fields

- `protected static AxisAlignedBB TALL_GRASS_AABB`
- `static PropertyEnum<BlockTallGrass.EnumType> TYPE`
