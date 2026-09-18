# ItemBanner

## Class signature

```java
public class ItemBanner extends ItemBlock
```

## Constructors

- `public ItemBanner()`

## Methods

- `public boolean onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `public int getColorFromItemStack( ItemStack stack, int renderPass)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`
- `public CreativeTabs getCreativeTab()`

## Description

allows items to add custom lines of information to the mouseover description