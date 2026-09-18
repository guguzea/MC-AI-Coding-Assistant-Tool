# BlockWallSign

## Class signature

```java
public class BlockWallSign extends BlockSign
```

## Constructors

- `public BlockWallSign()`

## Methods

- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Convert the BlockState into the correct metadata value