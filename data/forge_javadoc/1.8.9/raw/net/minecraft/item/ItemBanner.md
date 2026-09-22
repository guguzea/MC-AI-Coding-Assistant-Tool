---
title: "ItemBanner"
description: "public class ItemBanner extends ItemBlock"
package: "net/minecraft/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemBanner.html"
sourceType: javadoc
---

# ItemBanner

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemBlock → net.minecraft.item.ItemBanner

## Class signature

```java
public class ItemBanner extends ItemBlock
```

## Methods

- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)` — allows items to add custom lines of information to the mouseover description
- `int getColorFromItemStack(ItemStack stack, int renderPass)`
- `CreativeTabs getCreativeTab()` — gets the CreativeTab this item is displayed on
- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `void getSubItems(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> subItems)` — returns a list of items with the same ID, but different meta (eg: dye returns 16 items)
- `boolean onItemUse(ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)` — Called when a Block is right-clicked with this Item

## Fields

- `ItemBanner`
