# BlockPressurePlateWeighted

## Class signature

```java
public class BlockPressurePlateWeighted extends BlockBasePressurePlate
```

## Constructors

- `protected BlockPressurePlateWeighted( Material materialIn, int p_i46379_2_)`
- `protected BlockPressurePlateWeighted( Material materialIn, int p_i46380_2_, MapColor color)`

## Methods

- `protected int computeRedstoneStrength( World worldIn, BlockPos pos)`
- `protected void playClickOnSound( World worldIn, BlockPos color)`
- `protected void playClickOffSound( World worldIn, BlockPos pos)`
- `protected int getRedstoneStrength( IBlockState state)`
- `protected IBlockState setRedstoneStrength( IBlockState state, int strength)`
- `public int tickRate( World worldIn)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`