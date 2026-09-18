# IBlockProperties

## Class signature

```java
public interface IBlockProperties
```

## Methods

- `Material getMaterial()`
- `boolean isFullBlock()`
- `@Deprecated int getLightOpacity()`
- `int getLightOpacity( IBlockAccess world, BlockPos pos)`
- `@Deprecated int getLightValue()`
- `int getLightValue( IBlockAccess world, BlockPos pos)`
- `boolean isTranslucent()`
- `boolean useNeighborBrightness()`
- `MapColor getMapColor()`
- `IBlockState withRotation( Rotation rot)`
- `IBlockState withMirror( Mirror mirrorIn)`
- `boolean isFullCube()`
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
- `@Nullable AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos)`
- `void addCollisionBoxToList( World worldIn, BlockPos pos, AxisAlignedBB p_185908_3_, java.util.List< AxisAlignedBB > p_185908_4_, @Nullable Entity p_185908_5_)`
- `AxisAlignedBB getBoundingBox( IBlockAccess blockAccess, BlockPos pos)`
- `RayTraceResult collisionRayTrace( World worldIn, BlockPos pos, Vec3d start, Vec3d end)`
- `@Deprecated boolean isFullyOpaque()`
- `boolean doesSideBlockRendering( IBlockAccess world, BlockPos pos, EnumFacing side)`
- `boolean isSideSolid( IBlockAccess world, BlockPos pos, EnumFacing side)`

## Description

Deprecated.