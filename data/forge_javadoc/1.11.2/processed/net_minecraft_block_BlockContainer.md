# BlockContainer

## Class signature

```java
public abstract class BlockContainer extends Block implements ITileEntityProvider
```

## Constructors

- `protected BlockContainer( Material materialIn)`
- `protected BlockContainer( Material materialIn, MapColor color)`

## Methods

- `protected boolean isInvalidNeighbor( World worldIn, BlockPos pos, EnumFacing facing)`
- `protected boolean hasInvalidNeighbor( World worldIn, BlockPos pos)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, @Nullable TileEntity te, ItemStack stack)`
- `public boolean eventReceived( IBlockState state, World worldIn, BlockPos pos, int id, int param)`