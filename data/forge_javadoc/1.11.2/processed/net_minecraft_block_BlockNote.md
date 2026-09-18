# BlockNote

## Class signature

```java
public class BlockNote extends BlockContainer
```

## Constructors

- `public BlockNote()`

## Methods

- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public void onBlockClicked( World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public boolean eventReceived( IBlockState state, World worldIn, BlockPos pos, int id, int param)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`