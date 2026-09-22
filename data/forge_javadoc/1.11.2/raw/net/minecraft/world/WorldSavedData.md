---
title: "WorldSavedData"
description: "public abstract class WorldSavedData extends java.lang.Object implements INBTSerializable<NBTTagCompound>"
package: "net/minecraft/world"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/WorldSavedData.html"
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
- `abstract NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `java.lang.String mapName`
