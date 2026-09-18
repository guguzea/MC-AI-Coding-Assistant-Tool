# BlockPortal

## Class signature

```java
public class BlockPortal extends BlockBreakable
```

## Constructors

- `public BlockPortal()`

## Methods

- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public static int getMetaForAxis( EnumFacing.Axis axis)`
- `public boolean isFullCube()`
- `public boolean func_176548_d( World worldIn, BlockPos p_176548_2_)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public boolean shouldSideBeRendered( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public int quantityDropped(java.util.Random random)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public IBlockState getStateFromMeta(int meta)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public BlockPattern.PatternHelper func_181089_f( World p_181089_1_, BlockPos p_181089_2_)`

## Description

Convert the BlockState into the correct metadata value