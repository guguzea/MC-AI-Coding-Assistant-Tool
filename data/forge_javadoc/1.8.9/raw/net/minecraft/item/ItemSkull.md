---
title: "ItemSkull"
description: "public class ItemSkull extends Item"
package: "net/minecraft/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemSkull.html"
sourceType: javadoc
---

# ItemSkull

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemSkull

## Class signature

```java
public class ItemSkull extends Item
```

## Methods

- `java.lang.String getItemStackDisplayName(ItemStack stack)`
- `int getMetadata(int damage)` — Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks).
- `void getSubItems(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> subItems)` — returns a list of items with the same ID, but different meta (eg: dye returns 16 items)
- `java.lang.String getUnlocalizedName(ItemStack stack)` — Returns the unlocalized name of this item.
- `boolean onItemUse(ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)` — Called when a Block is right-clicked with this Item
- `boolean updateItemStackNBT(NBTTagCompound nbt)` — Called when an ItemStack with NBT data is read to potentially that ItemStack's NBT data

## Fields

- `ItemSkull`
