---
title: "WorldSavedData"
description: "public abstract class WorldSavedData extends java.lang.Object implements INBTSerializable < NBTTagCompound >"
package: "net/minecraft/world"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/WorldSavedData.html"
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
