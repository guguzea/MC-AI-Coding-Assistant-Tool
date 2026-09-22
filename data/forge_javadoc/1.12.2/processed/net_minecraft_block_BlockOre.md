# BlockOre

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockOre

## Class signature

```java
public class BlockOre extends Block
```

## Methods

- `int damageDropped(IBlockState state)`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `int getExpDrop(IBlockState state, IBlockAccess world, BlockPos pos, int fortune)` — Gathers how much experience this block drops when broken.
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int quantityDropped(java.util.Random random)`
- `int quantityDroppedWithBonus(int fortune, java.util.Random random)`

## Fields

- `BlockOre`
- `BlockOre`