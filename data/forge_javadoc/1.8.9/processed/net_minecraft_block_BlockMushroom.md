# BlockMushroom

## Class signature

```java
public class BlockMushroom extends BlockBush implements IGrowable
```

## Constructors

- `protected BlockMushroom()`

## Methods

- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `protected boolean canPlaceBlockOn( Block ground)`
- `public boolean canBlockStay( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean generateBigMushroom( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean canGrow( World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `public boolean canUseBonemeal( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public void grow( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`

## Description

Whether this IGrowable can grow