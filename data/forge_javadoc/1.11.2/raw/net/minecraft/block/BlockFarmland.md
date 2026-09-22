---
title: "BlockFarmland"
description: "public class BlockFarmland extends Block"
package: "net/minecraft/block"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockFarmland.html"
sourceType: javadoc
---

# BlockFarmland

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockFarmland

## Class signature

```java
public class BlockFarmland extends Block
```

## Constructors

- `BlockFarmland()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onFallenUpon(World worldIn, BlockPos pos, Entity entityIn, float fallDistance)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected static AxisAlignedBB FARMLAND_AABB`
- `static PropertyInteger MOISTURE`
