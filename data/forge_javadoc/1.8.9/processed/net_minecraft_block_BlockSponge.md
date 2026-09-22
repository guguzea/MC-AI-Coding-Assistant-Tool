# BlockSponge

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockSponge

## Class signature

```java
public class BlockSponge extends Block
```

## Constructors

- `BlockSponge()`

## Methods

- `protected BlockState createBlockState()`
- `int damageDropped(IBlockState state)` — Gets the metadata of the item this Block can drop.
- `java.lang.String getLocalizedName()` — Gets the localized name of this block.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)` — returns a list of blocks with the same ID, but different meta (eg: wood returns 4 blocks)
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `protected void tryAbsorb(World worldIn, BlockPos pos, IBlockState state)`

## Fields

- `static PropertyBool WET`