# BlockSapling

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockSapling

## Class signature

```java
public class BlockSapling extends BlockBush implements IGrowable
```

## Constructors

- `BlockSapling()`

## Methods

- `boolean canGrow(World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `boolean canUseBonemeal(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `int damageDropped(IBlockState state)`
- `void generateTree(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `java.lang.String getLocalizedName()`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(CreativeTabs itemIn, NonNullList<ItemStack> items)`
- `void grow(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `void grow(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `boolean isTypeAt(World worldIn, BlockPos pos, BlockPlanks.EnumType type)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected static AxisAlignedBB SAPLING_AABB`
- `static PropertyInteger STAGE`
- `static PropertyEnum<BlockPlanks.EnumType> TYPE`