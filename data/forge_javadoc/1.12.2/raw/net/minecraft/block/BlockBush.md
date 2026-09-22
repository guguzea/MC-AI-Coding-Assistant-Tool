---
title: "BlockBush"
description: "public class BlockBush extends Block implements IPlantable"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockBush.html"
sourceType: javadoc
---

# BlockBush

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBush

## Class signature

```java
public class BlockBush extends Block implements IPlantable
```

## Constructors

- `BlockBush()`
- `BlockBush(Material materialIn)`
- `BlockBush(Material materialIn, MapColor mapColorIn)`

## Methods

- `boolean canBlockStay(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected boolean canSustainBush(IBlockState state)`
- `protected void checkAndDropBlock(World worldIn, BlockPos pos, IBlockState state)`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `IBlockState getPlant(IBlockAccess world, BlockPos pos)`
- `EnumPlantType getPlantType(IBlockAccess world, BlockPos pos)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected static AxisAlignedBB BUSH_AABB`
