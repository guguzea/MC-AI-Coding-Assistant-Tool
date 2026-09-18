# BlockDoor

## Class signature

```java
public class BlockDoor extends Block
```

## Constructors

- `protected BlockDoor( Material materialIn)`

## Methods

- `public java.lang.String getLocalizedName()`
- `public boolean isOpaqueCube()`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean isFullCube()`
- `public AxisAlignedBB getSelectedBoundingBox( World worldIn, BlockPos pos)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void toggleDoor( World worldIn, BlockPos pos, boolean open)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public MovingObjectPosition collisionRayTrace( World worldIn, BlockPos pos, Vec3 start, Vec3 end)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public int getMobilityFlag()`
- `public static int combineMetadata( IBlockAccess worldIn, BlockPos pos)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public IBlockState getStateFromMeta(int meta)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public int getMetaFromState( IBlockState state)`
- `protected static int removeHalfBit(int meta)`
- `public static boolean isOpen( IBlockAccess worldIn, BlockPos pos)`
- `public static EnumFacing getFacing( IBlockAccess worldIn, BlockPos pos)`
- `public static EnumFacing getFacing(int combinedMeta)`
- `protected static boolean isOpen(int combinedMeta)`
- `protected static boolean isTop(int meta)`
- `protected static boolean isHingeLeft(int combinedMeta)`
- `protected BlockState createBlockState()`

## Description

Ray traces through the blocks collision from start vector to end vector returning a ray trace hit.