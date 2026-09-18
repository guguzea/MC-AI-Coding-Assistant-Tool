# BlockHugeMushroom

## Class signature

```java
public class BlockHugeMushroom extends Block
```

## Constructors

- `public BlockHugeMushroom( Material p_i46392_1_, MapColor p_i46392_2_, Block p_i46392_3_)`

## Methods

- `public int quantityDropped(java.util.Random random)`
- `public MapColor getMapColor( IBlockState state)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public IBlockState getStateFromMeta(int meta)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public boolean rotateBlock( World world, BlockPos pos, EnumFacing axis)`

## Description

Get the Item that this Block should drop when harvested.