# BlockContainer

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockContainer

## Class signature

```java
public abstract class BlockContainer extends Block implements ITileEntityProvider
```

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected boolean func_181086_a(World p_181086_1_, BlockPos p_181086_2_, EnumFacing p_181086_3_)`
- `protected boolean func_181087_e(World p_181087_1_, BlockPos p_181087_2_)`
- `int getRenderType()` — The type of render function called. 3 for standard block models, 2 for TESR's, 1 for liquids, -1 is no render
- `boolean onBlockEventReceived(World worldIn, BlockPos pos, IBlockState state, int eventID, int eventParam)` — Called on both Client and Server when World#addBlockEvent is called

## Fields

- `protected BlockContainer`
- `protected BlockContainer`