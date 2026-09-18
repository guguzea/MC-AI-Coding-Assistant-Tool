---
title: "ItemShield"
description: "public class ItemShield extends Item"
package: "net/minecraft/item"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/item/ItemShield.html"
sourceType: javadoc
---

# ItemShield

## Class signature

```java
public class ItemShield extends Item
```

## Constructors

- `public ItemShield()`

## Methods

- `public EnumActionResult onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`
- `public CreativeTabs getCreativeTab()`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public ActionResult < ItemStack > onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `public boolean getIsRepairable( ItemStack toRepair, ItemStack repair)`
