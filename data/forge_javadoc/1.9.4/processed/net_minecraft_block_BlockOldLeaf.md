# BlockOldLeaf

## Class signature

```java
public class BlockOldLeaf extends BlockLeaves
```

## Constructors

- `public BlockOldLeaf()`

## Methods

- `protected void dropApple( World worldIn, BlockPos pos, IBlockState state, int chance)`
- `protected int getSaplingDropChance( IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `protected ItemStack createStackedBlock( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public BlockPlanks.EnumType getWoodType(int meta)`
- `protected BlockStateContainer createBlockState()`
- `public int damageDropped( IBlockState state)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, @Nullable TileEntity te, @Nullable ItemStack stack)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

Performs the shear function on this object.