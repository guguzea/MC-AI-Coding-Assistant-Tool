# BlockRailPowered

## Class signature

```java
public class BlockRailPowered extends BlockRailBase
```

## Constructors

- `protected BlockRailPowered()`

## Methods

- `protected boolean findPoweredRailSignal( World worldIn, BlockPos pos, IBlockState state, boolean p_176566_4_, int p_176566_5_)`
- `protected boolean isSameRailWithPower( World worldIn, BlockPos pos, boolean p_176567_3_, int distance, BlockRailBase.EnumRailDirection p_176567_5_)`
- `protected void updateState( IBlockState p_189541_1_, World p_189541_2_, BlockPos p_189541_3_, Block p_189541_4_)`
- `public IProperty < BlockRailBase.EnumRailDirection > getShapeProperty()`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`