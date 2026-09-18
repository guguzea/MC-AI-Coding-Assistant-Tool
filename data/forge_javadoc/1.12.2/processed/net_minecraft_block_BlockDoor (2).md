# BlockDoor

## Class signature

```java
public class BlockDoor extends Block
```

## Constructors

- `protected BlockDoor( Material materialIn)`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public java.lang.String getLocalizedName()`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean isFullCube( IBlockState state)`
- `public MapColor getMapColor( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public void toggleDoor( World worldIn, BlockPos pos, boolean open)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public EnumPushReaction getMobilityFlag( IBlockState state)`
- `public static int combineMetadata( IBlockAccess worldIn, BlockPos pos)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public BlockRenderLayer getBlockLayer()`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected static int removeHalfBit(int meta)`
- `public static boolean isOpen( IBlockAccess worldIn, BlockPos pos)`
- `public static EnumFacing getFacing( IBlockAccess worldIn, BlockPos pos)`
- `public static EnumFacing getFacing(int combinedMeta)`
- `protected static boolean isOpen(int combinedMeta)`
- `protected static boolean isTop(int meta)`
- `protected BlockStateContainer createBlockState()`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`