# BlockLeaves

## Class signature

```java
public abstract class BlockLeaves extends Block implements IShearable
```

## Constructors

- `public BlockLeaves()`

## Methods

- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public int quantityDropped(java.util.Random random)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `protected void dropApple( World worldIn, BlockPos pos, IBlockState state, int chance)`
- `protected int getSaplingDropChance( IBlockState state)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public void setGraphicsLevel(boolean fancy)`
- `public BlockRenderLayer getBlockLayer()`
- `public boolean causesSuffocation( IBlockState state)`
- `public abstract BlockPlanks.EnumType getWoodType(int meta)`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public boolean isLeaves( IBlockState state, IBlockAccess world, BlockPos pos)`
- `public void beginLeavesDecay( IBlockState state, World world, BlockPos pos)`
- `public void getDrops( NonNullList < ItemStack > drops, IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`
- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`

## Description

Called when a leaf should start its decay process.