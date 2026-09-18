---
title: "ItemMap"
description: "public class ItemMap extends ItemMapBase"
package: "net/minecraft/item"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/item/ItemMap.html"
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

- `public static ItemStack setupNewMap( World worldIn, double worldX, double worldZ, byte scale, boolean trackingPosition, boolean unlimitedTracking)`
- `public static MapData loadMapData(int mapId, World worldIn)`
- `public MapData getMapData( ItemStack stack, World worldIn)`
- `public void updateMapData( World worldIn, Entity viewer, MapData data)`
- `public static void renderBiomePreviewMap( World worldIn, ItemStack map)`
- `public void onUpdate( ItemStack stack, World worldIn, Entity entityIn, int itemSlot, boolean isSelected)`
- `public Packet <?> createMapDataPacket( ItemStack stack, World worldIn, EntityPlayer player)`
- `public void onCreated( ItemStack stack, World worldIn, EntityPlayer playerIn)`
- `protected static void scaleMap( ItemStack p_185063_0_, World p_185063_1_, int p_185063_2_)`
- `protected static void enableMapTracking( ItemStack p_185064_0_, World p_185064_1_)`
- `public void addInformation( ItemStack stack, World worldIn, java.util.List<java.lang.String> tooltip, ITooltipFlag flagIn)`
- `public static int getColor( ItemStack p_190907_0_)`
