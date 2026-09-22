# BlockBanner.BlockBannerHanging

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockBanner → net.minecraft.block.BlockBanner.BlockBannerHanging

## Class signature

```java
public static class BlockBanner.BlockBannerHanging extends BlockBanner
```

## Constructors

- `BlockBannerHanging()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected static AxisAlignedBB EAST_AABB`
- `protected static AxisAlignedBB NORTH_AABB`
- `protected static AxisAlignedBB SOUTH_AABB`
- `protected static AxisAlignedBB WEST_AABB`