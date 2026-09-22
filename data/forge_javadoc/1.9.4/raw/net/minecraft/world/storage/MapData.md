---
title: "MapData"
description: "public class MapData extends WorldSavedData"
package: "net/minecraft/world/storage"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/storage/MapData.html"
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
- `NBTTagCompound writeToNBT(NBTTagCompound p_189551_1_)`

## Fields

- `byte[] colors`
- `int dimension`
- `java.util.Map<java.lang.String, Vec4b> mapDecorations`
- `java.util.List<MapData.MapInfo> playersArrayList`
- `byte scale`
- `boolean trackingPosition`
- `int xCenter`
- `int zCenter`
