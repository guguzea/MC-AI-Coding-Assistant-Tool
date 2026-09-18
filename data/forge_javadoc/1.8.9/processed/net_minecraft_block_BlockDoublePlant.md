# BlockDoublePlant

## Class signature

```java
public class BlockDoublePlant extends BlockBush implements IGrowable , IShearable
```

## Constructors

- `public BlockDoublePlant()`

## Methods

- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public BlockDoublePlant.EnumPlantType getVariant( IBlockAccess worldIn, BlockPos pos)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public boolean isReplaceable( World worldIn, BlockPos pos)`
- `protected void checkAndDropBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canBlockStay( World worldIn, BlockPos pos, IBlockState state)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int damageDropped( IBlockState state)`
- `public int colorMultiplier( IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `public void placeAt( World worldIn, BlockPos lowerPos, BlockDoublePlant.EnumPlantType variant, int flags)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public int getDamageValue( World worldIn, BlockPos pos)`
- `public boolean canGrow( World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `public boolean canUseBonemeal( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public void grow( World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public Block.EnumOffsetType getOffsetType()`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`
- `public boolean removedByPlayer( World world, BlockPos pos, EntityPlayer player, boolean willHarvest)`

## Description

Whether this IGrowable can grow