# BlockRedstoneDiode

## Class signature

```java
public abstract class BlockRedstoneDiode extends BlockHorizontal
```

## Constructors

- `protected BlockRedstoneDiode(boolean powered)`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public boolean canBlockStay( World worldIn, BlockPos pos)`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `protected boolean isPowered( IBlockState state)`
- `public int getStrongPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public int getWeakPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `protected void updateState( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isLocked( IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `protected boolean shouldBePowered( World worldIn, BlockPos pos, IBlockState state)`
- `protected int calculateInputStrength( World worldIn, BlockPos pos, IBlockState state)`
- `protected int getPowerOnSides( IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `protected int getPowerOnSide( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public boolean canProvidePower( IBlockState state)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `protected void notifyNeighbors( World worldIn, BlockPos pos, IBlockState state)`
- `public void onBlockDestroyedByPlayer( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube( IBlockState state)`
- `protected boolean isAlternateInput( IBlockState state)`
- `protected int getActiveSignal( IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `public static boolean isDiode( IBlockState state)`
- `public boolean isSameDiode( IBlockState state)`
- `public boolean isFacingTowardsRepeater( World worldIn, BlockPos pos, IBlockState state)`
- `protected int getTickDelay( IBlockState state)`
- `protected abstract int getDelay( IBlockState state)`
- `protected abstract IBlockState getPoweredState( IBlockState unpoweredState)`
- `protected abstract IBlockState getUnpoweredState( IBlockState poweredState)`
- `public boolean isAssociatedBlock( Block other)`
- `public BlockRenderLayer getBlockLayer()`