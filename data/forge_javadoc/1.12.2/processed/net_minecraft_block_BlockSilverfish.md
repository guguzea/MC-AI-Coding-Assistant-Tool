# BlockSilverfish

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockSilverfish

## Class signature

```java
public class BlockSilverfish extends Block
```

## Constructors

- `BlockSilverfish()`

## Methods

- `static boolean canContainSilverfish(IBlockState blockState)`
- `protected BlockStateContainer createBlockState()`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `protected ItemStack getSilkTouchDrop(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(CreativeTabs itemIn, NonNullList<ItemStack> items)`
- `int quantityDropped(java.util.Random random)`

## Fields

- `static PropertyEnum<BlockSilverfish.EnumType> VARIANT`