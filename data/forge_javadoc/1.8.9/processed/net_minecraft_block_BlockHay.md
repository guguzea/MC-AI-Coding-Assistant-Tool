# BlockHay

## Class signature

```java
public class BlockHay extends BlockRotatedPillar
```

## Constructors

- `public BlockHay()`

## Methods

- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `protected ItemStack createStackedBlock( IBlockState state)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`

## Description

Convert the BlockState into the correct metadata value