# BlockStone

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockStone

## Class signature

```java
public class BlockStone extends Block
```

## Constructors

- `BlockStone()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `int damageDropped(IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `java.lang.String getLocalizedName()`
- `MapColor getMapColor(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(CreativeTabs itemIn, NonNullList<ItemStack> items)`

## Fields

- `static PropertyEnum<BlockStone.EnumType> VARIANT`