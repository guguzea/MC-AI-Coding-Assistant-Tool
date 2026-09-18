# BlockStoneSlab

## Class signature

```java
public abstract class BlockStoneSlab extends BlockSlab
```

## Constructors

- `public BlockStoneSlab()`

## Methods

- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public java.lang.String getUnlocalizedName(int meta)`
- `public IProperty <?> getVariantProperty()`
- `public java.lang.Comparable<?> getTypeForItem( ItemStack stack)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, NonNullList < ItemStack > list)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public int damageDropped( IBlockState state)`
- `public MapColor getMapColor( IBlockState state)`