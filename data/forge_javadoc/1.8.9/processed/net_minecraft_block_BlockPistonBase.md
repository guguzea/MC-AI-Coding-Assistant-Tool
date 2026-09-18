# BlockPistonBase

## Class signature

```java
public class BlockPistonBase extends Block
```

## Constructors

- `public BlockPistonBase(boolean isSticky)`

## Methods

- `public boolean isOpaqueCube()`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public boolean onBlockEventReceived( World worldIn, BlockPos pos, IBlockState state, int eventID, int eventParam)`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public void setBlockBoundsForItemRender()`
- `public void addCollisionBoxesToList( World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List< AxisAlignedBB > list, Entity collidingEntity)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isFullCube()`
- `public static EnumFacing getFacing(int meta)`
- `public static EnumFacing getFacingFromEntity( World worldIn, BlockPos clickedBlock, EntityLivingBase entityIn)`
- `public static boolean canPush( Block blockIn, World worldIn, BlockPos pos, EnumFacing direction, boolean allowDestroy)`
- `public IBlockState getStateFromMeta(int meta)`
- `public IBlockState getStateForEntityRender( IBlockState state)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Add all collision boxes of this Block to the list that intersect with the given mask.