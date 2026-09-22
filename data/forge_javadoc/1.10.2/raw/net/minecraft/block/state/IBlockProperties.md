---
title: "IBlockProperties"
description: "public interface IBlockProperties"
package: "net/minecraft/block/state"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/state/IBlockProperties.html"
sourceType: javadoc
---

# IBlockProperties

## Class signature

```java
public interface IBlockProperties
```

## Methods

- `void addCollisionBoxToList(World worldIn, BlockPos pos, AxisAlignedBB p_185908_3_, java.util.List<AxisAlignedBB> p_185908_4_, Entity p_185908_5_)`
- `boolean canEntitySpawn(Entity entityIn)`
- `boolean canProvidePower()`
- `RayTraceResult collisionRayTrace(World worldIn, BlockPos pos, Vec3d start, Vec3d end)`
- `boolean doesSideBlockRendering(IBlockAccess world, BlockPos pos, EnumFacing side)`
- `IBlockState getActualState(IBlockAccess blockAccess, BlockPos pos)`
- `float getAmbientOcclusionLightValue()`
- `float getBlockHardness(World worldIn, BlockPos pos)`
- `AxisAlignedBB getBoundingBox(IBlockAccess blockAccess, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos)`
- `int getComparatorInputOverride(World worldIn, BlockPos pos)`
- `@Deprecated int getLightOpacity()`
- `int getLightOpacity(IBlockAccess world, BlockPos pos)`
- `@Deprecated int getLightValue()`
- `int getLightValue(IBlockAccess world, BlockPos pos)`
- `MapColor getMapColor()`
- `Material getMaterial()`
- `EnumPushReaction getMobilityFlag()`
- `int getPackedLightmapCoords(IBlockAccess source, BlockPos pos)`
- `float getPlayerRelativeBlockHardness(EntityPlayer player, World worldIn, BlockPos pos)`
- `EnumBlockRenderType getRenderType()`
- `AxisAlignedBB getSelectedBoundingBox(World worldIn, BlockPos pos)`
- `int getStrongPower(IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `int getWeakPower(IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `boolean hasComparatorInputOverride()`
- `boolean isBlockNormalCube()`
- `boolean isFullBlock()`
- `boolean isFullCube()`
- `@Deprecated boolean isFullyOpaque()`
- `boolean isNormalCube()`
- `boolean isOpaqueCube()`
- `boolean isSideSolid(IBlockAccess world, BlockPos pos, EnumFacing side)`
- `boolean isTranslucent()`
- `boolean shouldSideBeRendered(IBlockAccess blockAccess, BlockPos pos, EnumFacing facing)`
- `boolean useNeighborBrightness()`
- `IBlockState withMirror(Mirror mirrorIn)`
- `IBlockState withRotation(Rotation rot)`
