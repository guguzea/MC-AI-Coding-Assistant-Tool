---
title: "WorldSavedData"
description: "public abstract class WorldSavedData extends java.lang.Object implements INBTSerializable<NBTTagCompound>"
package: "net/minecraft/world"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/WorldSavedData.html"
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
