# BlockSapling

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockSapling

## Class signature

```java
public class BlockSapling extends BlockBush implements IGrowable
```

## Constructors

- `BlockSapling()`

## Methods

- `boolean canGrow(World worldIn, BlockPos pos, IBlockState state, boolean isClient)` — Whether this IGrowable can grow
- `boolean canUseBonemeal(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `protected BlockState createBlockState()`
- `int damageDropped(IBlockState state)` — Gets the metadata of the item this Block can drop.
- `void generateTree(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `java.lang.String getLocalizedName()` — Gets the localized name of this block.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)` — returns a list of blocks with the same ID, but different meta (eg: wood returns 4 blocks)
- `void grow(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `void grow(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `boolean isTypeAt(World worldIn, BlockPos pos, BlockPlanks.EnumType type)` — Check whether the given BlockPos has a Sapling of the given type
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger STAGE`
- `static PropertyEnum<BlockPlanks.EnumType> TYPE`