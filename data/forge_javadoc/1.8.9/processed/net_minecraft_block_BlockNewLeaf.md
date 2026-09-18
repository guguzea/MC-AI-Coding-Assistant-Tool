# BlockNewLeaf

## Class signature

```java
public class BlockNewLeaf extends BlockLeaves
```

## Constructors

- `public BlockNewLeaf()`

## Methods

- `protected void dropApple( World worldIn, BlockPos pos, IBlockState state, int chance)`
- `public int damageDropped( IBlockState state)`
- `public int getDamageValue( World worldIn, BlockPos pos)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `protected ItemStack createStackedBlock( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public BlockPlanks.EnumType getWoodType(int meta)`
- `protected BlockState createBlockState()`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

Gets the metadata of the item this Block can drop.