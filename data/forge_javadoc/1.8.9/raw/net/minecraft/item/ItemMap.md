---
title: "ItemMap"
description: "allows items to add custom lines of information to the mouseover description"
package: "net/minecraft/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemMap.html"
sourceType: javadoc
---

# ItemMap

## Class signature

```java
public class ItemMap extends ItemMapBase
```

## Constructors

- `protected ItemMap()`

## Methods

- `public static MapData loadMapData(int mapId, World worldIn)`
- `public MapData getMapData( ItemStack stack, World worldIn)`
- `public void updateMapData( World worldIn, Entity viewer, MapData data)`
- `public void onUpdate( ItemStack stack, World worldIn, Entity entityIn, int itemSlot, boolean isSelected)`
- `public Packet createMapDataPacket( ItemStack stack, World worldIn, EntityPlayer player)`
- `public void onCreated( ItemStack stack, World worldIn, EntityPlayer playerIn)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`

## Description

allows items to add custom lines of information to the mouseover description
