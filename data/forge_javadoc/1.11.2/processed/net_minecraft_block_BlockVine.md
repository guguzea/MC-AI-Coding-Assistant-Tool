# BlockVine

## Class signature

```java
public class BlockVine extends Block implements IShearable
```

## Constructors

- `public BlockVine()`

## Methods

- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean isReplaceable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, @Nullable TileEntity te, ItemStack stack)`
- `public IBlockState getStateFromMeta(int meta)`
- `public BlockRenderLayer getBlockLayer()`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `public static PropertyBool getPropertyFor( EnumFacing side)`
- `public static int getNumGrownFaces( IBlockState state)`
- `public boolean isLadder( IBlockState state, IBlockAccess world, BlockPos pos, EntityLivingBase entity)`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

FORGE START