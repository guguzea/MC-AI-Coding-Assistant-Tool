# BlockRedstoneLight

## Class signature

```java
public class BlockRedstoneLight extends Block
```

## Constructors

- `public BlockRedstoneLight(boolean isOn)`

## Methods

- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `protected ItemStack createStackedBlock( IBlockState state)`

## Description

Get the Item that this Block should drop when harvested.