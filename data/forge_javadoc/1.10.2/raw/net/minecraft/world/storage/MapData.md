---
title: "MapData"
description: "public class MapData extends WorldSavedData"
package: "net/minecraft/world/storage"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/MapData.html"
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
- `@Nullable public Packet <?> getMapPacket( ItemStack mapStack, World worldIn, EntityPlayer player)`
- `public void updateMapData(int x, int y)`
- `public MapData.MapInfo getMapInfo( EntityPlayer player)`
