# BlockPurpurSlab

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockSlab → net.minecraft.block.BlockPurpurSlab

## Class signature

```java
public abstract class BlockPurpurSlab extends BlockSlab
```

## Constructors

- `BlockPurpurSlab()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `java.lang.Comparable<?> getTypeForItem(ItemStack stack)`
- `java.lang.String getUnlocalizedName(int meta)`
- `IProperty<?> getVariantProperty()`

## Fields

- `static PropertyEnum<BlockPurpurSlab.Variant> VARIANT`