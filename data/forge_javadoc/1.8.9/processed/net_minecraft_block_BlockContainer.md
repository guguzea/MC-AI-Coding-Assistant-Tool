# BlockContainer

## Class signature

```java
public abstract class BlockContainer extends Block implements ITileEntityProvider
```

## Constructors

- `protected BlockContainer( Material materialIn)`
- `protected BlockContainer( Material p_i46402_1_, MapColor p_i46402_2_)`

## Methods

- `protected boolean func_181086_a( World p_181086_1_, BlockPos p_181086_2_, EnumFacing p_181086_3_)`
- `protected boolean func_181087_e( World p_181087_1_, BlockPos p_181087_2_)`
- `public int getRenderType()`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean onBlockEventReceived( World worldIn, BlockPos pos, IBlockState state, int eventID, int eventParam)`

## Description

The type of render function called. 3 for standard block models, 2 for TESR's, 1 for liquids, -1 is no render