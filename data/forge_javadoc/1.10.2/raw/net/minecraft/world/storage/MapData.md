---
title: "MapData"
description: "public class MapData extends WorldSavedData"
package: "net/minecraft/world/storage"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/MapData.html"
sourceType: javadoc
---

# MapData

**Inheritance:** java.lang.Object → net.minecraft.world.WorldSavedData → net.minecraft.world.storage.MapData

## Class signature

```java
public class MapData extends WorldSavedData
```

## Constructors

- `MapData(java.lang.String mapname)`

## Methods

- `void calculateMapCenter(double x, double z, int mapScale)`
- `MapData.MapInfo getMapInfo(EntityPlayer player)`
- `Packet<?> getMapPacket(ItemStack mapStack, World worldIn, EntityPlayer player)`
- `void readFromNBT(NBTTagCompound nbt)`
- `void updateMapData(int x, int y)`
- `void updateVisiblePlayers(EntityPlayer player, ItemStack mapStack)`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `byte[] colors`
- `int dimension`
- `java.util.Map<java.lang.String, Vec4b> mapDecorations`
- `java.util.List<MapData.MapInfo> playersArrayList`
- `byte scale`
- `boolean trackingPosition`
- `int xCenter`
- `int zCenter`
