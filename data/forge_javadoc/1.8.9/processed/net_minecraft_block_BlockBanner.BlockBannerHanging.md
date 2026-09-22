# BlockBanner.BlockBannerHanging

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockBanner → net.minecraft.block.BlockBanner.BlockBannerHanging

## Class signature

```java
public static class BlockBanner.BlockBannerHanging extends BlockBanner
```

## Methods

- `protected BlockState createBlockState()`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`

## Fields

- `BlockBannerHanging`