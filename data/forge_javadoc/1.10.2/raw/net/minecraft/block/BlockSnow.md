---
title: "BlockSnow"
description: "public class BlockSnow extends Block"
package: "net/minecraft/block"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockSnow.html"
sourceType: javadoc
---

# BlockSnow

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockSnow

## Class signature

```java
public class BlockSnow extends Block
```

## Constructors

- `BlockSnow()`

## Methods

- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `boolean isFullCube(IBlockState state)`
- `boolean isFullyOpaque(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `boolean isReplaceable(IBlockAccess worldIn, BlockPos pos)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `int quantityDropped(IBlockState state, int fortune, java.util.Random random)` — State and fortune sensitive version, this replaces the old (int meta, Random rand) version in 1.1.
- `int quantityDropped(java.util.Random random)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger LAYERS`
- `protected static AxisAlignedBB [] SNOW_AABB`
