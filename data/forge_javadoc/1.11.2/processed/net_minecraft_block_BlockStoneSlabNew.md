# BlockStoneSlabNew

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockSlab → net.minecraft.block.BlockStoneSlabNew

## Class signature

```java
public abstract class BlockStoneSlabNew extends BlockSlab
```

## Constructors

- `BlockStoneSlabNew()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `int damageDropped(IBlockState state)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `java.lang.String getLocalizedName()`
- `MapColor getMapColor(IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(Item itemIn, CreativeTabs tab, NonNullList<ItemStack> list)`
- `java.lang.Comparable<?> getTypeForItem(ItemStack stack)`
- `java.lang.String getUnlocalizedName(int meta)`
- `IProperty<?> getVariantProperty()`

## Fields

- `static PropertyBool SEAMLESS`
- `static PropertyEnum<BlockStoneSlabNew.EnumType> VARIANT`