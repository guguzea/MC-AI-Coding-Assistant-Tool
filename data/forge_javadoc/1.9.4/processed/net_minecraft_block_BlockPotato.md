# BlockPotato

## Class signature

```java
public class BlockPotato extends BlockCrops
```

## Constructors

- `public BlockPotato()`

## Methods

- `protected Item getSeed()`
- `protected Item getCrop()`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`

## Description

This returns a complete list of items dropped from this block.