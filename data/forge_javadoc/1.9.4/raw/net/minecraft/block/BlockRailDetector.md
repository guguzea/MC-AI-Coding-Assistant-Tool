---
title: "BlockRailDetector"
description: "public class BlockRailDetector extends BlockRailBase"
package: "net/minecraft/block"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockRailDetector.html"
sourceType: javadoc
---

# BlockRailDetector

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockRailBase → net.minecraft.block.BlockRailDetector

## Class signature

```java
public class BlockRailDetector extends BlockRailBase
```

## Constructors

- `BlockRailDetector()`

## Methods

- `boolean canProvidePower(IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `protected<T extends EntityMinecart> java.util.List<T> findMinecarts(World worldIn, BlockPos pos, java.lang.Class<T> clazz, com.google.common.base.Predicate<Entity>... filter)`
- `int getComparatorInputOverride(IBlockState blockState, World worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IProperty<BlockRailBase.EnumRailDirection> getShapeProperty()`
- `IBlockState getStateFromMeta(int meta)`
- `int getStrongPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `int getWeakPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `boolean hasComparatorInputOverride(IBlockState state)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `void randomTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `int tickRate(World worldIn)`
- `protected void updateConnectedRails(World worldIn, BlockPos pos, IBlockState state, boolean p_185592_4_)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyBool POWERED`
- `static PropertyEnum<BlockRailBase.EnumRailDirection> SHAPE`
