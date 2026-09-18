# BlockRail

## Class signature

```java
public class BlockRail extends BlockRailBase
```

## Constructors

- `protected BlockRail()`

## Methods

- `protected void onNeighborChangedInternal( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public IProperty < BlockRailBase.EnumRailDirection > getShapeProperty()`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Convert the BlockState into the correct metadata value