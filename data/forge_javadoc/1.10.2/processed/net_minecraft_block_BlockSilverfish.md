# BlockSilverfish

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockSilverfish

## Class signature

```java
public class BlockSilverfish extends Block
```

## Constructors

- `BlockSilverfish()`

## Methods

- `static boolean canContainSilverfish(IBlockState blockState)`
- `protected BlockStateContainer createBlockState()`
- `protected ItemStack createStackedBlock(IBlockState state)`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)`
- `int quantityDropped(java.util.Random random)`

## Fields

- `static PropertyEnum<BlockSilverfish.EnumType> VARIANT`