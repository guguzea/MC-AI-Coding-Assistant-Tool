---
title: "WorldSavedData"
description: "public abstract class WorldSavedData extends java.lang.Object implements INBTSerializable<NBTTagCompound>"
package: "net/minecraft/world"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/WorldSavedData.html"
sourceType: javadoc
---

# WorldSavedData

**Inheritance:** java.lang.Object → net.minecraft.world.WorldSavedData

## Class signature

```java
public abstract class WorldSavedData extends java.lang.Object implements INBTSerializable<NBTTagCompound>
```

## Constructors

- `WorldSavedData(java.lang.String name)`

## Methods

- `void deserializeNBT(NBTTagCompound nbt)`
- `boolean isDirty()`
- `void markDirty()`
- `abstract void readFromNBT(NBTTagCompound nbt)`
- `NBTTagCompound serializeNBT()`
- `void setDirty(boolean isDirty)`
- `abstract NBTTagCompound writeToNBT(NBTTagCompound p_189551_1_)`

## Fields

- `java.lang.String mapName`
