---
title: "ItemRecord"
description: "Retrieves the resource location of the sound to play for this record."
package: "net/minecraft/item"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/item/ItemRecord.html"
sourceType: javadoc
---

# ItemRecord

## Class signature

```java
public class ItemRecord extends Item
```

## Constructors

- `protected ItemRecord(java.lang.String p_i46742_1_, SoundEvent soundIn)`

## Methods

- `public EnumActionResult onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `public ResourceLocation getRecordResource(java.lang.String name)`
- `public java.lang.String getRecordNameLocal()`
- `public EnumRarity getRarity( ItemStack stack)`
- `@Nullable public static ItemRecord getBySound( SoundEvent soundIn)`
- `public SoundEvent getSound()`

## Description

Retrieves the resource location of the sound to play for this record.
