# BlockEndPortal

## Class signature

```java
public class BlockEndPortal extends BlockContainer
```

## Constructors

- `protected BlockEndPortal( Material materialIn)`

## Methods

- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public void addCollisionBoxToList( IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, @Nullable Entity entityIn, boolean p_185477_7_)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public int quantityDropped(java.util.Random random)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public MapColor getMapColor( IBlockState state)`