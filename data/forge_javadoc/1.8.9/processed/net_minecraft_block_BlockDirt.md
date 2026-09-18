# BlockDirt

## Class signature

```java
public class BlockDirt extends Block
```

## Constructors

- `protected BlockDirt()`

## Methods

- `public MapColor getMapColor( IBlockState state)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public int getDamageValue( World worldIn, BlockPos pos)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public int damageDropped( IBlockState state)`

## Description

Gets the metadata of the item this Block can drop.