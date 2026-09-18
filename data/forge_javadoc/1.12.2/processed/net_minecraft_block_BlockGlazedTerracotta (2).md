# BlockGlazedTerracotta

## Class signature

```java
public class BlockGlazedTerracotta extends BlockHorizontal
```

## Constructors

- `public BlockGlazedTerracotta( EnumDyeColor color)`

## Methods

- `protected BlockStateContainer createBlockState()`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public EnumPushReaction getMobilityFlag( IBlockState state)`