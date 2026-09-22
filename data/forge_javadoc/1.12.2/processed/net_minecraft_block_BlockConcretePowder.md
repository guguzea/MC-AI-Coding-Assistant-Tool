# BlockConcretePowder

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockFalling → net.minecraft.block.BlockConcretePowder

## Class signature

```java
public class BlockConcretePowder extends BlockFalling
```

## Constructors

- `BlockConcretePowder()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `int damageDropped(IBlockState state)`
- `MapColor getMapColor(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(CreativeTabs itemIn, NonNullList<ItemStack> items)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onEndFalling(World worldIn, BlockPos pos, IBlockState p_176502_3_, IBlockState p_176502_4_)`
- `protected boolean tryTouchWater(World worldIn, BlockPos pos, IBlockState state)`

## Fields

- `static PropertyEnum<EnumDyeColor> COLOR`