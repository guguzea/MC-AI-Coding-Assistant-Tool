# BlockStateContainer.StateImplementation

**Inheritance:** java.lang.Object → net.minecraft.block.state.BlockStateBase → net.minecraft.block.state.BlockStateContainer.StateImplementation

## Class signature

```java
public static class BlockStateContainer.StateImplementation extends BlockStateBase
```

## Constructors

- `StateImplementation(Block blockIn, com.google.common.collect.ImmutableMap<IProperty<?>, java.lang.Comparable<?>> propertiesIn)`
- `StateImplementation(Block blockIn, com.google.common.collect.ImmutableMap<IProperty<?>, java.lang.Comparable<?>> propertiesIn, com.google.common.collect.ImmutableTable<IProperty<?>, java.lang.Comparable<?>, IBlockState> propertyValueTable)`

## Methods

- `void addCollisionBoxToList(World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List<AxisAlignedBB> collidingBoxes, Entity entityIn, boolean p_185908_6_)`
- `void buildPropertyValueTable(java.util.Map<java.util.Map<IProperty<?>, java.lang.Comparable<?>>, BlockStateContainer.StateImplementation> map)`
- `boolean canEntitySpawn(Entity entityIn)`
- `boolean canProvidePower()`
- `boolean causesSuffocation()`
- `RayTraceResult collisionRayTrace(World worldIn, BlockPos pos, Vec3d start, Vec3d end)`
- `boolean doesSideBlockRendering(IBlockAccess world, BlockPos pos, EnumFacing side)`
- `boolean equals(java.lang.Object p_equals_1_)`
- `IBlockState getActualState(IBlockAccess blockAccess, BlockPos pos)`
- `float getAmbientOcclusionLightValue()`
- `Block getBlock()`
- `float getBlockHardness(World worldIn, BlockPos pos)`
- `AxisAlignedBB getBoundingBox(IBlockAccess blockAccess, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockAccess worldIn, BlockPos pos)`
- `int getComparatorInputOverride(World worldIn, BlockPos pos)`
- `int getLightOpacity()`
- `int getLightOpacity(IBlockAccess world, BlockPos pos)`
- `int getLightValue()`
- `int getLightValue(IBlockAccess world, BlockPos pos)`
- `MapColor getMapColor()`
- `Material getMaterial()`
- `EnumPushReaction getMobilityFlag()`
- `Vec3d getOffset(IBlockAccess access, BlockPos pos)`
- `int getPackedLightmapCoords(IBlockAccess source, BlockPos pos)`
- `float getPlayerRelativeBlockHardness(EntityPlayer player, World worldIn, BlockPos pos)`
- `com.google.common.collect.ImmutableMap<IProperty<?>, java.lang.Comparable<?>> getProperties()`
- `java.util.Collection<IProperty<?>> getPropertyKeys()`
- `com.google.common.collect.ImmutableTable<IProperty<?>, java.lang.Comparable<?>, IBlockState> getPropertyValueTable()`
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
- `boolean isFullyOpaque()`
- `boolean isNormalCube()`
- `boolean isOpaqueCube()`
- `boolean isSideSolid(IBlockAccess world, BlockPos pos, EnumFacing side)`
- `boolean isTranslucent()`
- `void neighborChanged(World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `boolean onBlockEventReceived(World worldIn, BlockPos pos, int id, int param)`
- `boolean shouldSideBeRendered(IBlockAccess blockAccess, BlockPos pos, EnumFacing facing)`
- `boolean useNeighborBrightness()`
- `IBlockState withMirror(Mirror mirrorIn)`
- `<T extends java.lang.Comparable<T>, V extends T> IBlockState withProperty(IProperty<T> property, V value)`
- `IBlockState withRotation(Rotation rot)`

## Fields

- `protected com.google.common.collect.ImmutableTable<IProperty<?>, java.lang.Comparable<?>, IBlockState> propertyValueTable`