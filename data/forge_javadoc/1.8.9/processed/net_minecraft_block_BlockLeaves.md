# BlockLeaves

## Class signature

```java
public abstract class BlockLeaves extends BlockLeavesBase implements IShearable
```

## Constructors

- `public BlockLeaves()`

## Methods

- `public int getBlockColor()`
- `public int getRenderColor( IBlockState state)`
- `public int colorMultiplier( IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public int quantityDropped(java.util.Random random)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `protected void dropApple( World worldIn, BlockPos pos, IBlockState state, int chance)`
- `protected int getSaplingDropChance( IBlockState state)`
- `public boolean isOpaqueCube()`
- `public void setGraphicsLevel(boolean fancy)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public boolean isVisuallyOpaque()`
- `public abstract BlockPlanks.EnumType getWoodType(int meta)`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public boolean isLeaves( IBlockAccess world, BlockPos pos)`
- `public void beginLeavesDecay( World world, BlockPos pos)`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`

## Description

Called when a leaf should start its decay process.