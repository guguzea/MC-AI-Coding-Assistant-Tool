# BlockPistonMoving

## Class signature

```java
public class BlockPistonMoving extends BlockContainer
```

## Constructors

- `public BlockPistonMoving()`

## Methods

- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public static TileEntity newTileEntity( IBlockState state, EnumFacing facing, boolean extending, boolean renderHead)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side)`
- `public void onBlockDestroyedByPlayer( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public MovingObjectPosition collisionRayTrace( World worldIn, BlockPos pos, Vec3 start, Vec3 end)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public AxisAlignedBB getBoundingBox( World worldIn, BlockPos pos, IBlockState extendingBlock, float progress, EnumFacing direction)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`

## Description

Check whether this Block can be placed on the given side