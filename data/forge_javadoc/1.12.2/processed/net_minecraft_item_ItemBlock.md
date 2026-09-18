# ItemBlock

## Class signature

```java
public class ItemBlock extends Item
```

## Constructors

- `public ItemBlock( Block block)`

## Methods

- `public EnumActionResult onItemUse( EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public static boolean setTileEntityNBT( World worldIn, EntityPlayer player, BlockPos pos, ItemStack stackIn)`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side, EntityPlayer player, ItemStack stack)`
- `public java.lang.String getUnlocalizedName( ItemStack stack)`
- `public java.lang.String getUnlocalizedName()`
- `public CreativeTabs getCreativeTab()`
- `public void getSubItems( CreativeTabs tab, NonNullList < ItemStack > items)`
- `public void addInformation( ItemStack stack, World worldIn, java.util.List<java.lang.String> tooltip, ITooltipFlag flagIn)`
- `public Block getBlock()`
- `public boolean placeBlockAt( ItemStack stack, EntityPlayer player, World world, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ, IBlockState newState)`

## Description

Called to actually place the block, after the location is determined and all permission checks have been made.