---
title: "DataWatcher"
description: "public class DataWatcher extends java.lang.Object"
package: "net/minecraft/entity"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/DataWatcher.html"
sourceType: javadoc
---

# DataWatcher

## Class signature

```java
public class DataWatcher extends java.lang.Object
```

## Constructors

- `public DataWatcher( Entity p_i45313_1_)`

## Methods

- `public void addObject(int p_75682_1_, java.lang.Object p_75682_2_)`
- `public void addObjectByDataType(int p_82709_1_, int p_82709_2_)`
- `public byte getWatchableObjectByte(int p_75683_1_)`
- `public short getWatchableObjectShort(int p_75693_1_)`
- `public int getWatchableObjectInt(int p_75679_1_)`
- `public float getWatchableObjectFloat(int p_111145_1_)`
- `public java.lang.String getWatchableObjectString(int p_75681_1_)`
- `public ItemStack getWatchableObjectItemStack(int p_82710_1_)`
- `public void updateObject(int p_75692_1_, java.lang.Object p_75692_2_)`
- `public void setObjectWatched(int p_82708_1_)`
- `public boolean hasChanges()`
- `public static void writeWatchedListToPacketBuffer(java.util.List p_151507_0_, PacketBuffer p_151507_1_) throws java.io.IOException`
- `public java.util.List getChanged()`
- `public void func_151509_a( PacketBuffer p_151509_1_) throws java.io.IOException`
- `public java.util.List getAllWatched()`
- `public static java.util.List readWatchedListFromPacketBuffer( PacketBuffer p_151508_0_) throws java.io.IOException`
- `public void updateWatchedObjectsFromList(java.util.List p_75687_1_)`
- `public boolean getIsBlank()`
- `public void func_111144_e()`
