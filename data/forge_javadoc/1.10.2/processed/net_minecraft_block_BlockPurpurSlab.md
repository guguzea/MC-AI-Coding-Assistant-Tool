# BlockPurpurSlab

## Class signature

```java
public abstract class BlockPurpurSlab extends BlockSlab
```

## Constructors

- `public BlockPurpurSlab()`

## Methods

- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public java.lang.String getUnlocalizedName(int meta)`
- `public IProperty <?> getVariantProperty()`
- `public java.lang.Comparable<?> getTypeForItem( ItemStack stack)`