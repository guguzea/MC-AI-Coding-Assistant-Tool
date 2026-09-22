# BlockFalling

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockFalling

## Class signature

```java
public class BlockFalling extends Block
```

## Constructors

- `BlockFalling()`
- `BlockFalling(Material materialIn)`

## Methods

- `static boolean canFallThrough(IBlockState state)`
- `int getDustColor(IBlockState p_189876_1_)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onEndFalling(World worldIn, BlockPos pos)`
- `protected void onStartFalling(EntityFallingBlock fallingEntity)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `int tickRate(World worldIn)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static boolean fallInstantly`