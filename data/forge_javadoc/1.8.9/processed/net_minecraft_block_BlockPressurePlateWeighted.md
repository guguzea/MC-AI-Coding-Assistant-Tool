# BlockPressurePlateWeighted

## Class signature

```java
public class BlockPressurePlateWeighted extends BlockBasePressurePlate
```

## Constructors

- `protected BlockPressurePlateWeighted( Material p_i46379_1_, int p_i46379_2_)`
- `protected BlockPressurePlateWeighted( Material p_i46380_1_, int p_i46380_2_, MapColor p_i46380_3_)`

## Methods

- `protected int computeRedstoneStrength( World worldIn, BlockPos pos)`
- `protected int getRedstoneStrength( IBlockState state)`
- `protected IBlockState setRedstoneStrength( IBlockState state, int strength)`
- `public int tickRate( World worldIn)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Convert the BlockState into the correct metadata value