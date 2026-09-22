---
title: "ItemRecord"
description: "public class ItemRecord extends Item"
package: "net/minecraft/item"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/item/ItemRecord.html"
sourceType: javadoc
---

# ItemRecord

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemRecord

## Class signature

```java
public class ItemRecord extends Item
```

## Methods

- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `static ItemRecord getBySound(SoundEvent soundIn)`
- `EnumRarity getRarity(ItemStack stack)`
- `java.lang.String getRecordNameLocal()`
- `ResourceLocation getRecordResource(java.lang.String name)` — Retrieves the resource location of the sound to play for this record.
- `SoundEvent getSound()`
- `EnumActionResult onItemUse(EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`

## Fields

- `protected ItemRecord`
