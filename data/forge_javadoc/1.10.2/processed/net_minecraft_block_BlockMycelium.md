# BlockMycelium

## Class signature

```java
public class BlockMycelium extends Block
```

## Constructors

- `protected BlockMycelium()`

## Methods

- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`