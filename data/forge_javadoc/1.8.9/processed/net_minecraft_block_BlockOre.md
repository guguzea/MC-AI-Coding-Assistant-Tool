# BlockOre

## Class signature

```java
public class BlockOre extends Block
```

## Constructors

- `public BlockOre()`
- `public BlockOre( MapColor p_i46390_1_)`

## Methods

- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `public int quantityDroppedWithBonus(int fortune, java.util.Random random)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public int getExpDrop( IBlockAccess world, BlockPos pos, int fortune)`
- `public int getDamageValue( World worldIn, BlockPos pos)`
- `public int damageDropped( IBlockState state)`

## Description

Gets the metadata of the item this Block can drop.