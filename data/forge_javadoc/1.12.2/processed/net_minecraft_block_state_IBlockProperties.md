# IBlockProperties

## Class signature

```java
public interface IBlockProperties
```

## Methods

- `Material getMaterial()`
- `boolean isFullBlock()`
- `boolean canEntitySpawn( Entity entityIn)`
- `@Deprecated int getLightOpacity()`
- `int getLightOpacity( IBlockAccess world, BlockPos pos)`
- `@Deprecated int getLightValue()`
- `int getLightValue( IBlockAccess world, BlockPos pos)`
- `boolean isTranslucent()`
- `boolean useNeighborBrightness()`
- `MapColor getMapColor( IBlockAccess p_185909_1_, BlockPos p_185909_2_)`
- `IBlockState withRotation( Rotation rot)`
- `IBlockState withMirror( Mirror mirrorIn)`
- `boolean isFullCube()`
- `boolean hasCustomBreakingProgress()`
- `EnumBlockRenderType getRenderType()`
- `int getPackedLightmapCoords( IBlockAccess source, BlockPos pos)`
- `float getAmbientOcclusionLightValue()`
- `boolean isBlockNormalCube()`
- `boolean isNormalCube()`
- `boolean canProvidePower()`
- `int getWeakPower( IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `boolean hasComparatorInputOverride()`
- `int getComparatorInputOverride( World worldIn, BlockPos pos)`
- `float getBlockHardness( World worldIn, BlockPos pos)`
- `float getPlayerRelativeBlockHardness( EntityPlayer player, World worldIn, BlockPos pos)`
- `int getStrongPower( IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `EnumPushReaction getMobilityFlag()`
- `IBlockState getActualState( IBlockAccess blockAccess, BlockPos pos)`
- `AxisAlignedBB getSelectedBoundingBox( World worldIn, BlockPos pos)`
- `boolean shouldSideBeRendered( IBlockAccess blockAccess, BlockPos pos, EnumFacing facing)`
- `boolean isOpaqueCube()`
- `AxisAlignedBB getCollisionBoundingBox( IBlockAccess worldIn, BlockPos pos)`
- `void addCollisionBoxToList( World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, Entity entityIn, boolean p_185908_6_)`
- `AxisAlignedBB getBoundingBox( IBlockAccess blockAccess, BlockPos pos)`
- `RayTraceResult collisionRayTrace( World worldIn, BlockPos pos, Vec3d start, Vec3d end)`
- `@Deprecated boolean isTopSolid()`
- `boolean doesSideBlockRendering( IBlockAccess world, BlockPos pos, EnumFacing side)`
- `boolean isSideSolid( IBlockAccess world, BlockPos pos, EnumFacing side)`
- `boolean doesSideBlockChestOpening( IBlockAccess world, BlockPos pos, EnumFacing side)`
- `Vec3d getOffset( IBlockAccess access, BlockPos pos)`
- `boolean causesSuffocation()`
- `BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, BlockPos pos, EnumFacing facing)`

## Description

Deprecated.