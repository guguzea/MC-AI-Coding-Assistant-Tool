---
title: "BlockBanner"
description: "public class BlockBanner extends BlockContainer"
package: "net/minecraft/block"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockBanner.html"
sourceType: javadoc
---

# BlockBanner

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockBanner

## Class signature

```java
public class BlockBanner extends BlockContainer
```

## Constructors

- `BlockBanner()`

## Methods

- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canSpawnInBlock()`
- `TileEntity createNewTileEntity(World worldIn, int meta)`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `java.util.List<ItemStack> getDrops(IBlockAccess world, BlockPos pos, IBlockState state, int fortune)` — This returns a complete list of items dropped from this block.
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `java.lang.String getLocalizedName()`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`

## Fields

- `static PropertyDirection FACING`
- `static PropertyInteger ROTATION`
- `protected static AxisAlignedBB STANDING_AABB`
