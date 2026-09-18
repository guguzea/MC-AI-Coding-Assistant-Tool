---
title: "ItemMap"
description: "public class ItemMap extends ItemMapBase"
package: "net/minecraft/item"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/item/ItemMap.html"
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

- `public static ItemStack setupNewMap( World p_190906_0_, double p_190906_1_, double p_190906_3_, byte p_190906_5_, boolean p_190906_6_, boolean p_190906_7_)`
- `@Nullable public static MapData loadMapData(int mapId, World worldIn)`
- `@Nullable public MapData getMapData( ItemStack stack, World worldIn)`
- `public void updateMapData( World worldIn, Entity viewer, MapData data)`
- `public static void renderBiomePreviewMap( World p_190905_0_, ItemStack p_190905_1_)`
- `public void onUpdate( ItemStack stack, World worldIn, Entity entityIn, int itemSlot, boolean isSelected)`
- `@Nullable public Packet <?> createMapDataPacket( ItemStack stack, World worldIn, EntityPlayer player)`
- `public void onCreated( ItemStack stack, World worldIn, EntityPlayer playerIn)`
- `protected static void scaleMap( ItemStack p_185063_0_, World p_185063_1_, int p_185063_2_)`
- `protected static void enableMapTracking( ItemStack p_185064_0_, World p_185064_1_)`
- `public void addInformation( ItemStack stack, EntityPlayer playerIn, java.util.List<java.lang.String> tooltip, boolean advanced)`
- `public static int getColor( ItemStack p_190907_0_)`
