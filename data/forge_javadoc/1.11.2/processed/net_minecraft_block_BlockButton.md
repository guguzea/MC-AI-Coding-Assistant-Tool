# BlockButton

## Class signature

```java
public abstract class BlockButton extends BlockDirectional
```

## Constructors

- `protected BlockButton(boolean wooden)`

## Methods

- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public int tickRate( World worldIn)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `protected static boolean canPlaceBlock( World worldIn, BlockPos pos, EnumFacing direction)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `protected abstract void playClickSound(@Nullable EntityPlayer player, World worldIn, BlockPos pos)`
- `protected abstract void playReleaseSound( World worldIn, BlockPos pos)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public int getWeakPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public int getStrongPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public boolean canProvidePower( IBlockState state)`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`