# BlockFalling

## Class signature

```java
public class BlockFalling extends Block
```

## Constructors

- `public BlockFalling()`
- `public BlockFalling( Material materialIn)`

## Methods

- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `protected void onStartFalling( EntityFallingBlock fallingEntity)`
- `public int tickRate( World worldIn)`
- `public static boolean canFallThrough( IBlockState state)`
- `public void onEndFalling( World worldIn, BlockPos pos)`