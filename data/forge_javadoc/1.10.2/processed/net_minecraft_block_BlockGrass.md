# BlockGrass

## Class signature

```java
public class BlockGrass extends Block implements IGrowable
```

## Constructors

- `protected BlockGrass()`

## Methods

- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public boolean canGrow( World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `public boolean canUseBonemeal( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public void grow( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public BlockRenderLayer getBlockLayer()`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`