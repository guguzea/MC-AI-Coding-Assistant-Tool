# BlockLog

## Class signature

```java
public abstract class BlockLog extends BlockRotatedPillar
```

## Constructors

- `public BlockLog()`

## Methods

- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public boolean canSustainLeaves( IBlockState state, IBlockAccess world, BlockPos pos)`
- `public boolean isWood( IBlockAccess world, BlockPos pos)`

## Description

Determines if this block can prevent leaves connected to it from decaying.