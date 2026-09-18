# BlockRailDetector

## Class signature

```java
public class BlockRailDetector extends BlockRailBase
```

## Constructors

- `public BlockRailDetector()`

## Methods

- `public int tickRate( World worldIn)`
- `public boolean canProvidePower( IBlockState state)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public int getWeakPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public int getStrongPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `protected void updateConnectedRails( World worldIn, BlockPos pos, IBlockState state, boolean powered)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public IProperty < BlockRailBase.EnumRailDirection > getShapeProperty()`
- `public boolean hasComparatorInputOverride( IBlockState state)`
- `public int getComparatorInputOverride( IBlockState blockState, World worldIn, BlockPos pos)`
- `protected <T extends EntityMinecart > java.util.List<T> findMinecarts( World worldIn, BlockPos pos, java.lang.Class<T> clazz, <any>... filter)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`