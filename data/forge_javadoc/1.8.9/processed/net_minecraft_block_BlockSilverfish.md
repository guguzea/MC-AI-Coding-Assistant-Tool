# BlockSilverfish

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockSilverfish

## Class signature

```java
public class BlockSilverfish extends Block
```

## Constructors

- `BlockSilverfish()`

## Methods

- `static boolean canContainSilverfish(IBlockState blockState)`
- `protected BlockState createBlockState()`
- `protected ItemStack createStackedBlock(IBlockState state)`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)` — Spawns this Block's drops into the World as EntityItems.
- `int getDamageValue(World worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)` — returns a list of blocks with the same ID, but different meta (eg: wood returns 4 blocks)
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.

## Fields

- `static PropertyEnum<BlockSilverfish.EnumType> VARIANT`