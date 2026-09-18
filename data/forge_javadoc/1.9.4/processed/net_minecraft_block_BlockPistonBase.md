# BlockPistonBase

## Class signature

```java
public class BlockPistonBase extends BlockDirectional
```

## Constructors

- `public BlockPistonBase(boolean isSticky)`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isFullyOpaque( IBlockState state)`
- `public void addCollisionBoxToList( IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, @Nullable Entity entityIn)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public boolean eventReceived( IBlockState state, World worldIn, BlockPos pos, int id, int param)`
- `public boolean isFullCube( IBlockState state)`
- `@Nullable public static EnumFacing getFacing(int meta)`
- `public static EnumFacing getFacingFromEntity( BlockPos pos, EntityLivingBase p_185647_1_)`
- `public static boolean canPush( IBlockState blockStateIn, World worldIn, BlockPos pos, EnumFacing facing, boolean destroyBlocks)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`