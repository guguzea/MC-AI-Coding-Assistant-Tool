# BlockPressurePlateWeighted

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockBasePressurePlate → net.minecraft.block.BlockPressurePlateWeighted

## Class signature

```java
public class BlockPressurePlateWeighted extends BlockBasePressurePlate
```

## Constructors

- `BlockPressurePlateWeighted(Material p_i46379_1_, int p_i46379_2_)`
- `BlockPressurePlateWeighted(Material p_i46380_1_, int p_i46380_2_, MapColor p_i46380_3_)`

## Methods

- `protected int computeRedstoneStrength(World worldIn, BlockPos pos)`
- `protected BlockState createBlockState()`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `protected int getRedstoneStrength(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `protected IBlockState setRedstoneStrength(IBlockState state, int strength)`
- `int tickRate(World worldIn)` — How many world ticks before ticking

## Fields

- `static PropertyInteger POWER`