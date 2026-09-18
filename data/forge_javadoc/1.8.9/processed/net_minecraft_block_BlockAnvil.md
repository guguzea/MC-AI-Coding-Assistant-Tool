# BlockAnvil

## Class signature

```java
public class BlockAnvil extends BlockFalling
```

## Constructors

- `protected BlockAnvil()`

## Methods

- `public boolean isFullCube()`
- `public boolean isOpaqueCube()`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public int damageDropped( IBlockState state)`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `protected void onStartFalling( EntityFallingBlock fallingEntity)`
- `public void onEndFalling( World worldIn, BlockPos pos)`
- `public boolean shouldSideBeRendered( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public IBlockState getStateFromMeta(int meta)`
- `public IBlockState getStateForEntityRender( IBlockState state)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Gets the metadata of the item this Block can drop.