---
title: "BlockStateContainer.StateImplementation"
description: "public static class BlockStateContainer.StateImplementation extends BlockStateBase"
package: "net/minecraft/block/state"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/state/BlockStateContainer.StateImplementation.html"
sourceType: javadoc
---

# BlockStateContainer.StateImplementation

**Inheritance:** java.lang.Object → net.minecraft.block.state.BlockStateBase → net.minecraft.block.state.BlockStateContainer.StateImplementation

## Class signature

```java
public static class BlockStateContainer.StateImplementation extends BlockStateBase
```

## Constructors

- `StateImplementation(Block blockIn, <any> propertiesIn)`
- `StateImplementation(Block blockIn, <any> propertiesIn, <any> propertyValueTable)`

## Methods

- `void addCollisionBoxToList(World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List<AxisAlignedBB> collidingBoxes, Entity entityIn, boolean p_185908_6_)`
- `void buildPropertyValueTable(java.util.Map<java.util.Map<IProperty<?>, java.lang.Comparable<?>>, BlockStateContainer.StateImplementation> map)`
- `boolean canEntitySpawn(Entity entityIn)`
- `boolean canProvidePower()`
- `boolean causesSuffocation()`
- `RayTraceResult collisionRayTrace(World worldIn, BlockPos pos, Vec3d start, Vec3d end)`
- `boolean doesSideBlockChestOpening(IBlockAccess world, BlockPos pos, EnumFacing side)`
- `boolean doesSideBlockRendering(IBlockAccess world, BlockPos pos, EnumFacing side)`
- `boolean equals(java.lang.Object p_equals_1_)`
- `IBlockState getActualState(IBlockAccess blockAccess, BlockPos pos)`
- `float getAmbientOcclusionLightValue()`
- `Block getBlock()`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, BlockPos pos, EnumFacing facing)`
- `float getBlockHardness(World worldIn, BlockPos pos)`
- `AxisAlignedBB getBoundingBox(IBlockAccess blockAccess, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockAccess worldIn, BlockPos pos)`
- `int getComparatorInputOverride(World worldIn, BlockPos pos)`
- `int getLightOpacity()`
- `int getLightOpacity(IBlockAccess world, BlockPos pos)`
- `int getLightValue()`
- `int getLightValue(IBlockAccess world, BlockPos pos)`
- `MapColor getMapColor(IBlockAccess p_185909_1_, BlockPos p_185909_2_)`
- `Material getMaterial()`
- `EnumPushReaction getMobilityFlag()`
- `Vec3d getOffset(IBlockAccess access, BlockPos pos)`
- `int getPackedLightmapCoords(IBlockAccess source, BlockPos pos)`
- `float getPlayerRelativeBlockHardness(EntityPlayer player, World worldIn, BlockPos pos)`
- `<any> getProperties()`
- `java.util.Collection<IProperty<?>> getPropertyKeys()`
- `<any> getPropertyValueTable()`
- `EnumBlockRenderType getRenderType()`
- `AxisAlignedBB getSelectedBoundingBox(World worldIn, BlockPos pos)`
- `int getStrongPower(IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `<T extends java.lang.Comparable<T>> T getValue(IProperty<T> property)`
- `int getWeakPower(IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `boolean hasComparatorInputOverride()`
- `boolean hasCustomBreakingProgress()`
- `int hashCode()`
- `boolean isBlockNormalCube()`
- `boolean isFullBlock()`
- `boolean isFullCube()`
- `boolean isNormalCube()`
- `boolean isOpaqueCube()`
- `boolean isSideSolid(IBlockAccess world, BlockPos pos, EnumFacing side)`
- `boolean isTopSolid()`
- `boolean isTranslucent()`
- `void neighborChanged(World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `boolean onBlockEventReceived(World worldIn, BlockPos pos, int id, int param)`
- `boolean shouldSideBeRendered(IBlockAccess blockAccess, BlockPos pos, EnumFacing facing)`
- `boolean useNeighborBrightness()`
- `IBlockState withMirror(Mirror mirrorIn)`
- `<T extends java.lang.Comparable<T>, V extends T> IBlockState withProperty(IProperty<T> property, V value)`
- `IBlockState withRotation(Rotation rot)`

## Fields

- `protected<any> propertyValueTable`
