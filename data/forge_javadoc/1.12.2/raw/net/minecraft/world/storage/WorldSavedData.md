---
title: "WorldSavedData"
description: "public abstract class WorldSavedData extends java.lang.Object implements INBTSerializable < NBTTagCompound >"
package: "net/minecraft/world/storage"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/WorldSavedData.html"
sourceType: javadoc
---

# WorldSavedData

## Class signature

```java
public abstract class WorldSavedData extends java.lang.Object implements INBTSerializable < NBTTagCompound >
```

## Constructors

- `public WorldSavedData(java.lang.String name)`

## Methods

- `public abstract void readFromNBT( NBTTagCompound nbt)`
- `public abstract NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void markDirty()`
- `public void setDirty(boolean isDirty)`
- `public boolean isDirty()`
- `public void deserializeNBT( NBTTagCompound nbt)`
- `public NBTTagCompound serializeNBT()`
