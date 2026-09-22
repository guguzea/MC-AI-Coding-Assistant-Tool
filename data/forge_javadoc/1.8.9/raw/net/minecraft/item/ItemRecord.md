---
title: "ItemRecord"
description: "public class ItemRecord extends Item"
package: "net/minecraft/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemRecord.html"
sourceType: javadoc
---

# ItemRecord

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemRecord

## Class signature

```java
public class ItemRecord extends Item
```

## Constructors

- `ItemRecord(java.lang.String name)`

## Methods

- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)` — allows items to add custom lines of information to the mouseover description
- `EnumRarity getRarity(ItemStack stack)` — Return an item rarity from EnumRarity
- `static ItemRecord getRecord(java.lang.String name)` — Return the record item corresponding to the given name.
- `java.lang.String getRecordNameLocal()`
- `ResourceLocation getRecordResource(java.lang.String name)` — Retrieves the resource location of the sound to play for this record.
- `boolean onItemUse(ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)` — Called when a Block is right-clicked with this Item

## Fields

- `java.lang.String recordName` — The name of the record.
