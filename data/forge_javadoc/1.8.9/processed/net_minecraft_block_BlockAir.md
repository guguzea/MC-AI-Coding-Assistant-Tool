# BlockAir

## Class signature

```java
public class BlockAir extends Block
```

## Constructors

- `protected BlockAir()`

## Methods

- `public int getRenderType()`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube()`
- `public boolean canCollideCheck( IBlockState state, boolean hitIfLiquid)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public boolean isReplaceable( World worldIn, BlockPos pos)`

## Description

Spawns this Block's drops into the World as EntityItems.