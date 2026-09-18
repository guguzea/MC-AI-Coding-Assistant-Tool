# BlockSign

## Class signature

```java
public class BlockSign extends BlockContainer
```

## Constructors

- `protected BlockSign()`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, World worldIn, BlockPos pos)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean canSpawnInBlock()`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, @Nullable ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`