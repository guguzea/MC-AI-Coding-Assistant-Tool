# BlockChest

## Class signature

```java
public class BlockChest extends BlockContainer
```

## Constructors

- `protected BlockChest( BlockChest.Type chestTypeIn)`

## Methods

- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean hasCustomBreakingProgress( IBlockState state)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public IBlockState checkForSurroundingChests( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState correctFacing( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `@Nullable public ILockableContainer getLockableContainer( World worldIn, BlockPos pos)`
- `@Nullable public ILockableContainer getContainer( World p_189418_1_, BlockPos p_189418_2_, boolean p_189418_3_)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public boolean canProvidePower( IBlockState state)`
- `public int getWeakPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public int getStrongPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public boolean hasComparatorInputOverride( IBlockState state)`
- `public int getComparatorInputOverride( IBlockState blockState, World worldIn, BlockPos pos)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`