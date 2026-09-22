# BlockPotato

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockCrops → net.minecraft.block.BlockPotato

## Class signature

```java
public class BlockPotato extends BlockCrops
```

## Methods

- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)` — Spawns this Block's drops into the World as EntityItems.
- `protected Item getCrop()`
- `java.util.List<ItemStack> getDrops(IBlockAccess world, BlockPos pos, IBlockState state, int fortune)` — This returns a complete list of items dropped from this block.
- `protected Item getSeed()`

## Fields

- `BlockPotato`