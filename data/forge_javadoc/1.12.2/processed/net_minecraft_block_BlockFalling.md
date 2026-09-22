# BlockFalling

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockFalling

## Class signature

```java
public class BlockFalling extends Block
```

## Constructors

- `BlockFalling()`
- `BlockFalling(Material materialIn)`

## Methods

- `static boolean canFallThrough(IBlockState state)`
- `int getDustColor(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onBroken(World worldIn, BlockPos pos)`
- `void onEndFalling(World worldIn, BlockPos pos, IBlockState p_176502_3_, IBlockState p_176502_4_)`
- `protected void onStartFalling(EntityFallingBlock fallingEntity)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `int tickRate(World worldIn)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static boolean fallInstantly`