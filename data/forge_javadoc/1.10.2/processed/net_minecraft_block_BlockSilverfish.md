# BlockSilverfish

## Class signature

```java
public class BlockSilverfish extends Block
```

## Constructors

- `public BlockSilverfish()`

## Methods

- `public int quantityDropped(java.util.Random random)`
- `public static boolean canContainSilverfish( IBlockState blockState)`
- `protected ItemStack createStackedBlock( IBlockState state)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`