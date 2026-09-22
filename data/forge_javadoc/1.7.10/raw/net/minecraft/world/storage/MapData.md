---
title: "MapData"
description: "public class MapData extends WorldSavedData"
package: "net/minecraft/world/storage"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/world/storage/MapData.html"
sourceType: javadoc
---

# MapData

**Inheritance:** java.lang.Object → net.minecraft.world.WorldSavedData → net.minecraft.world.storage.MapData

## Class signature

```java
public class MapData extends WorldSavedData
```

## Constructors

- `MapData(java.lang.String p_i2140_1_)`

## Methods

- `MapData.MapInfo func_82568_a(EntityPlayer p_82568_1_)`
- `byte[] getUpdatePacketData(ItemStack p_76193_1_, World p_76193_2_, EntityPlayer p_76193_3_)`
- `void readFromNBT(NBTTagCompound p_76184_1_)`
- `void setColumnDirty(int p_76194_1_, int p_76194_2_, int p_76194_3_)`
- `void updateMPMapData(byte[] p_76192_1_)`
- `void updateVisiblePlayers(EntityPlayer p_76191_1_, ItemStack p_76191_2_)`
- `void writeToNBT(NBTTagCompound p_76187_1_)`

## Fields

- `byte[] colors`
- `int dimension`
- `java.util.List playersArrayList`
- `java.util.Map playersVisibleOnMap`
- `byte scale`
- `int xCenter`
- `int zCenter`
