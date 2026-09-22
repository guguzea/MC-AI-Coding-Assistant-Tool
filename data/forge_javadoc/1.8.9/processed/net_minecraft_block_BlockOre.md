# BlockOre

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockOre

## Class signature

```java
public class BlockOre extends Block
```

## Methods

- `int damageDropped(IBlockState state)` — Gets the metadata of the item this Block can drop.
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)` — Spawns this Block's drops into the World as EntityItems.
- `int getDamageValue(World worldIn, BlockPos pos)`
- `int getExpDrop(IBlockAccess world, BlockPos pos, int fortune)` — Gathers how much experience this block drops when broken.
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.
- `int quantityDroppedWithBonus(int fortune, java.util.Random random)` — Get the quantity dropped based on the given fortune level

## Fields

- `BlockOre`
- `BlockOre`