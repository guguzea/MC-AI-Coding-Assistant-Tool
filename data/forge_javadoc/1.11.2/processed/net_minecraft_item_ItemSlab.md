# ItemSlab

## Class signature

```java
public class ItemSlab extends ItemBlock
```

## Constructors

- `public ItemSlab( Block block, BlockSlab singleSlab, BlockSlab doubleSlab)`

## Methods

- `public int getMetadata(int damage)`
- `public java.lang.String getUnlocalizedName( ItemStack stack)`
- `public EnumActionResult onItemUse( EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side, EntityPlayer player, ItemStack stack)`
- `protected <T extends java.lang.Comparable<T>> IBlockState makeState( IProperty <T> p_185055_1_, java.lang.Comparable<?> p_185055_2_)`