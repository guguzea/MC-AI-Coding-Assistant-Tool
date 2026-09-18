# BlockQuartz

## Class signature

```java
public class BlockQuartz extends Block
```

## Constructors

- `public BlockQuartz()`

## Methods

- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public int damageDropped( IBlockState state)`
- `protected ItemStack createStackedBlock( IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public MapColor getMapColor( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `protected BlockStateContainer createBlockState()`
- `public boolean rotateBlock( World world, BlockPos pos, EnumFacing axis)`

## Description

Rotate the block.