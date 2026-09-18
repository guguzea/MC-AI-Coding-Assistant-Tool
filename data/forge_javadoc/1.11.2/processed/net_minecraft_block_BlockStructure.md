# BlockStructure

## Class signature

```java
public class BlockStructure extends BlockContainer
```

## Constructors

- `public BlockStructure()`

## Methods

- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public int quantityDropped(java.util.Random random)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`