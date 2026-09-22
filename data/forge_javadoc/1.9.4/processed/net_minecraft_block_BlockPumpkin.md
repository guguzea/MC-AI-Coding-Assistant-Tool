# BlockPumpkin

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockHorizontal → net.minecraft.block.BlockPumpkin

## Class signature

```java
public class BlockPumpkin extends BlockHorizontal
```

## Methods

- `boolean canDispenserPlace(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `protected BlockPattern getGolemBasePattern()`
- `protected BlockPattern getGolemPattern()`
- `int getMetaFromState(IBlockState state)`
- `protected BlockPattern getSnowmanBasePattern()`
- `protected BlockPattern getSnowmanPattern()`
- `IBlockState getStateFromMeta(int meta)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected BlockPumpkin`