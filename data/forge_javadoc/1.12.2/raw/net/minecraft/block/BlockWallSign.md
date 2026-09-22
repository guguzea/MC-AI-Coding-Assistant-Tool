---
title: "BlockWallSign"
description: "public class BlockWallSign extends BlockSign"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockWallSign.html"
sourceType: javadoc
---

# BlockWallSign

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockSign → net.minecraft.block.BlockWallSign

## Class signature

```java
public class BlockWallSign extends BlockSign
```

## Constructors

- `BlockWallSign()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyDirection FACING`
- `protected static AxisAlignedBB SIGN_EAST_AABB`
- `protected static AxisAlignedBB SIGN_NORTH_AABB`
- `protected static AxisAlignedBB SIGN_SOUTH_AABB`
- `protected static AxisAlignedBB SIGN_WEST_AABB`
