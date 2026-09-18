# BlockWoodSlab

## Class signature

```java
public abstract class BlockWoodSlab extends BlockSlab
```

## Constructors

- `public BlockWoodSlab()`

## Methods

- `public MapColor getMapColor( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public java.lang.String getUnlocalizedName(int meta)`
- `public IProperty <?> getVariantProperty()`
- `public java.lang.Comparable<?> getTypeForItem( ItemStack stack)`
- `public void getSubBlocks( CreativeTabs itemIn, NonNullList < ItemStack > items)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public int damageDropped( IBlockState state)`