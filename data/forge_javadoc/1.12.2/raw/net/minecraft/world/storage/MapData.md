---
title: "MapData"
description: "public class MapData extends WorldSavedData"
package: "net/minecraft/world/storage"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/MapData.html"
sourceType: javadoc
---

# MapData

## Class signature

```java
public class MapData extends WorldSavedData
```

## Constructors

- `public MapData(java.lang.String mapname)`

## Methods

- `public void calculateMapCenter(double x, double z, int mapScale)`
- `public void readFromNBT( NBTTagCompound nbt)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void updateVisiblePlayers( EntityPlayer player, ItemStack mapStack)`
- `public static void addTargetDecoration( ItemStack map, BlockPos target, java.lang.String decorationName, MapDecoration.Type type)`
- `public Packet <?> getMapPacket( ItemStack mapStack, World worldIn, EntityPlayer player)`
- `public void updateMapData(int x, int y)`
- `public MapData.MapInfo getMapInfo( EntityPlayer player)`
