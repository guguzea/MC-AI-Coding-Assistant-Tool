# BlockPressurePlateWeighted

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBasePressurePlate → net.minecraft.block.BlockPressurePlateWeighted

## Class signature

```java
public class BlockPressurePlateWeighted extends BlockBasePressurePlate
```

## Constructors

- `BlockPressurePlateWeighted(Material materialIn, int p_i46379_2_)`
- `BlockPressurePlateWeighted(Material materialIn, int p_i46380_2_, MapColor color)`

## Methods

- `protected int computeRedstoneStrength(World worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `int getMetaFromState(IBlockState state)`
- `protected int getRedstoneStrength(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `protected void playClickOffSound(World worldIn, BlockPos pos)`
- `protected void playClickOnSound(World worldIn, BlockPos color)`
- `protected IBlockState setRedstoneStrength(IBlockState state, int strength)`
- `int tickRate(World worldIn)`

## Fields

- `static PropertyInteger POWER`