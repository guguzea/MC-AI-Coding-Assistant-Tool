---
title: "WorldSavedData"
description: "public abstract class WorldSavedData extends java.lang.Object implements INBTSerializable<NBTTagCompound>"
package: "net/minecraft/world/storage"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/WorldSavedData.html"
sourceType: javadoc
---

# WorldSavedData

**Inheritance:** java.lang.Object → net.minecraft.world.storage.WorldSavedData

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
