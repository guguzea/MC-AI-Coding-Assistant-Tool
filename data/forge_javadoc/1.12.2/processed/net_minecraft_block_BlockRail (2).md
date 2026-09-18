# BlockRail

## Class signature

```java
public class BlockRail extends BlockRailBase
```

## Constructors

- `protected BlockRail()`

## Methods

- `protected void updateState( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `public IProperty < BlockRailBase.EnumRailDirection > getShapeProperty()`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`