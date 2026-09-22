---
title: "ItemHoe"
description: "public class ItemHoe extends Item"
package: "net/minecraft/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemHoe.html"
sourceType: javadoc
---

# ItemHoe

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemHoe

## Class signature

```java
public class ItemHoe extends Item
```

## Constructors

- `ItemHoe(Item.ToolMaterial material)`

## Methods

- `java.lang.String getMaterialName()` — Returns the name of the material this tool is made from as it is declared in EnumToolMaterial (meaning diamond would return "EMERALD")
- `boolean isFull3D()` — Returns True is the item is renderer in full 3D when hold.
- `boolean onItemUse(ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)` — Called when a Block is right-clicked with this Item
- `protected boolean useHoe(ItemStack stack, EntityPlayer player, World worldIn, BlockPos target, IBlockState newState)`

## Fields

- `protected Item.ToolMaterial theToolMaterial`
