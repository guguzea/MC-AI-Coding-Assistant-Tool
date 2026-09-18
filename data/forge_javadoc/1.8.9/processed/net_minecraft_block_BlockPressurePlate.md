# BlockPressurePlate

## Class signature

```java
public class BlockPressurePlate extends BlockBasePressurePlate
```

## Constructors

- `protected BlockPressurePlate( Material materialIn, BlockPressurePlate.Sensitivity sensitivityIn)`

## Methods

- `protected int getRedstoneStrength( IBlockState state)`
- `protected IBlockState setRedstoneStrength( IBlockState state, int strength)`
- `protected int computeRedstoneStrength( World worldIn, BlockPos pos)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Convert the BlockState into the correct metadata value