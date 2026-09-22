# BlockStoneSlabNew

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockSlab → net.minecraft.block.BlockStoneSlabNew

## Class signature

```java
public abstract class BlockStoneSlabNew extends BlockSlab
```

## Constructors

- `BlockStoneSlabNew()`

## Methods

- `protected BlockState createBlockState()`
- `int damageDropped(IBlockState state)` — Gets the metadata of the item this Block can drop.
- `Item getItem(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `java.lang.String getLocalizedName()` — Gets the localized name of this block.
- `MapColor getMapColor(IBlockState state)` — Get the MapColor for this Block and the given BlockState
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)` — returns a list of blocks with the same ID, but different meta (eg: wood returns 4 blocks)
- `java.lang.String getUnlocalizedName(int meta)` — Returns the slab block name with the type associated with it
- `java.lang.Object getVariant(ItemStack stack)`
- `IProperty<?> getVariantProperty()`

## Fields

- `static PropertyBool SEAMLESS`
- `static PropertyEnum<BlockStoneSlabNew.EnumType> VARIANT`