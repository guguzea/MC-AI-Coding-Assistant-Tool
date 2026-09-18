# BlockBed

## Class signature

```java
public class BlockBed extends BlockHorizontal implements ITileEntityProvider
```

## Constructors

- `public BlockBed()`

## Methods

- `public MapColor getMapColor( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public void onFallenUpon( World worldIn, BlockPos pos, Entity entityIn, float fallDistance)`
- `public void onLanded( World worldIn, Entity entityIn)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean hasCustomBreakingProgress( IBlockState state)`
- `public static BlockPos getSafeExitLocation( World worldIn, BlockPos pos, int tries)`
- `protected static boolean hasRoomForPlayer( World worldIn, BlockPos pos)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public EnumPushReaction getMobilityFlag( IBlockState state)`
- `public BlockRenderLayer getBlockLayer()`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `public int getMetaFromState( IBlockState state)`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `protected BlockStateContainer createBlockState()`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public static boolean isHeadPiece(int metadata)`