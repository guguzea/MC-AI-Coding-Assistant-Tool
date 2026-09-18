# BlockSponge

## Class signature

```java
public class BlockSponge extends Block
```

## Constructors

- `protected BlockSponge()`

## Methods

- `public java.lang.String getLocalizedName()`
- `public int damageDropped( IBlockState state)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `protected void tryAbsorb( World worldIn, BlockPos pos, IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Description

Gets the metadata of the item this Block can drop.