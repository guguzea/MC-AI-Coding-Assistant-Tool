---
title: "ItemMap"
description: "public class ItemMap extends ItemMapBase"
package: "net/minecraft/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemMap.html"
sourceType: javadoc
---

# ItemMap

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemMapBase → net.minecraft.item.ItemMap

## Class signature

```java
public class ItemMap extends ItemMapBase
```

## Methods

- `void addInformation(ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)` — allows items to add custom lines of information to the mouseover description
- `Packet createMapDataPacket(ItemStack stack, World worldIn, EntityPlayer player)`
- `MapData getMapData(ItemStack stack, World worldIn)`
- `static MapData loadMapData(int mapId, World worldIn)`
- `void onCreated(ItemStack stack, World worldIn, EntityPlayer playerIn)` — Called when item is crafted/smelted.
- `void onUpdate(ItemStack stack, World worldIn, Entity entityIn, int itemSlot, boolean isSelected)` — Called each tick as long the item is on a player inventory.
- `void updateMapData(World worldIn, Entity viewer, MapData data)`

## Fields

- `protected ItemMap`
