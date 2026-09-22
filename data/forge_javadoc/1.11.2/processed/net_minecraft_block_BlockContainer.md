# BlockContainer

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer

## Class signature

```java
public abstract class BlockContainer extends Block implements ITileEntityProvider
```

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean eventReceived(IBlockState state, World worldIn, BlockPos pos, int id, int param)`
- `EnumBlockRenderType getRenderType(IBlockState state)`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `protected boolean hasInvalidNeighbor(World worldIn, BlockPos pos)`
- `protected boolean isInvalidNeighbor(World worldIn, BlockPos pos, EnumFacing facing)`

## Fields

- `protected BlockContainer`
- `protected BlockContainer`