# BlockStaticLiquid

## Class signature

```java
public class BlockStaticLiquid extends BlockLiquid
```

## Constructors

- `protected BlockStaticLiquid( Material materialIn)`

## Methods

- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `protected boolean isSurroundingBlockFlammable( World worldIn, BlockPos pos)`

## Description

Called when a neighboring block changes.