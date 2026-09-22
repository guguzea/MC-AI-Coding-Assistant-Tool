# BlockWallSign

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockSign → net.minecraft.block.BlockWallSign

## Class signature

```java
public class BlockWallSign extends BlockSign
```

## Constructors

- `BlockWallSign()`

## Methods

- `protected BlockState createBlockState()`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`

## Fields

- `static PropertyDirection FACING`