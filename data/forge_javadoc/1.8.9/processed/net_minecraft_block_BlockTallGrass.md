# BlockTallGrass

## Class signature

```java
public class BlockTallGrass extends BlockBush implements IGrowable , IShearable
```

## Constructors

- `protected BlockTallGrass()`

## Methods

- `public int getBlockColor()`
- `public boolean canBlockStay( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isReplaceable( World worldIn, BlockPos pos)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDroppedWithBonus(int fortune, java.util.Random random)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`
- `public int getRenderColor( IBlockState state)`
- `public int colorMultiplier( IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `public int getDamageValue( World worldIn, BlockPos pos)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public boolean canGrow( World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `public boolean canUseBonemeal( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public void grow( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public Block.EnumOffsetType getOffsetType()`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`
- `public java.util.List< ItemStack > getDrops( IBlockAccess world, BlockPos pos, IBlockState state, int fortune)`

## Description

Whether this IGrowable can grow