# BlockGrassPath

## Class signature

```java
public class BlockGrassPath extends Block
```

## Constructors

- `protected BlockGrassPath()`

## Methods

- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`