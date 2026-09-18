# BlockOre

## Class signature

```java
public class BlockOre extends Block
```

## Constructors

- `public BlockOre()`
- `public BlockOre( MapColor color)`

## Methods

- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `public int quantityDroppedWithBonus(int fortune, java.util.Random random)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public int getExpDrop( IBlockState state, IBlockAccess world, BlockPos pos, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public int damageDropped( IBlockState state)`

## Description

Gathers how much experience this block drops when broken.