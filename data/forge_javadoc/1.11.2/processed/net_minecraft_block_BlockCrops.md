# BlockCrops

## Class signature

```java
public class BlockCrops extends BlockBush implements IGrowable
```

## Constructors

- `protected BlockCrops()`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `protected boolean canSustainBush( IBlockState state)`
- `protected PropertyInteger getAgeProperty()`
- `public int getMaxAge()`
- `protected int getAge( IBlockState state)`
- `public IBlockState withAge(int age)`
- `public boolean isMaxAge( IBlockState state)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void grow( World worldIn, BlockPos pos, IBlockState state)`
- `protected int getBonemealAgeIncrease( World worldIn)`
- `protected static float getGrowthChance( Block blockIn, World worldIn, BlockPos pos)`
- `public boolean canBlockStay( World worldIn, BlockPos pos, IBlockState state)`
- `protected Item getSeed()`
- `protected Item getCrop()`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canGrow( World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `public boolean canUseBonemeal( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public void grow( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`

## Description

This returns a complete list of items dropped from this block.