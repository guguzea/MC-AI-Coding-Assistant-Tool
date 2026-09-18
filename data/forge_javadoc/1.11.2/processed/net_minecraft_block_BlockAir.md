# BlockAir

## Class signature

```java
public class BlockAir extends Block
```

## Constructors

- `protected BlockAir()`

## Methods

- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean canCollideCheck( IBlockState state, boolean hitIfLiquid)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public boolean isReplaceable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean isFullCube( IBlockState state)`