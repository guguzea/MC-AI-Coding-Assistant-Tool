# BlockShulkerBox

## Class signature

```java
public class BlockShulkerBox extends BlockContainer
```

## Constructors

- `public BlockShulkerBox( EnumDyeColor colorIn)`

## Methods

- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean causesSuffocation( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean hasCustomBreakingProgress( IBlockState state)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `protected BlockStateContainer createBlockState()`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void addInformation( ItemStack stack, World player, java.util.List<java.lang.String> tooltip, ITooltipFlag advanced)`
- `public EnumPushReaction getMobilityFlag( IBlockState state)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean hasComparatorInputOverride( IBlockState state)`
- `public int getComparatorInputOverride( IBlockState blockState, World worldIn, BlockPos pos)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public static Block getBlockByColor( EnumDyeColor colorIn)`
- `public static EnumDyeColor getColorFromItem( Item itemIn)`
- `public static ItemStack getColoredItemStack( EnumDyeColor colorIn)`
- `public static EnumDyeColor getColorFromBlock( Block blockIn)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `public EnumDyeColor getColor()`