# BlockPumpkin

## Class signature

```java
public class BlockPumpkin extends BlockDirectional
```

## Constructors

- `protected BlockPumpkin()`

## Methods

- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canDispenserPlace( World worldIn, BlockPos pos)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `protected BlockPattern getSnowmanBasePattern()`
- `protected BlockPattern getSnowmanPattern()`
- `protected BlockPattern getGolemBasePattern()`
- `protected BlockPattern getGolemPattern()`

## Description

Convert the BlockState into the correct metadata value