# BlockSeaLantern

## Class signature

```java
public class BlockSeaLantern extends Block
```

## Constructors

- `public BlockSeaLantern( Material materialIn)`

## Methods

- `public int quantityDropped(java.util.Random random)`
- `public int quantityDroppedWithBonus(int fortune, java.util.Random random)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public MapColor getMapColor( IBlockState state)`
- `protected boolean canSilkHarvest()`

## Description

Get the Item that this Block should drop when harvested.