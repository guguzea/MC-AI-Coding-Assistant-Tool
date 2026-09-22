---
title: "AnvilSaveHandler"
description: "public class AnvilSaveHandler extends SaveHandler"
package: "net/minecraft/world/chunk/storage"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/storage/AnvilSaveHandler.html"
sourceType: javadoc
---

# AnvilSaveHandler

**Inheritance:** java.lang.Object → net.minecraft.world.storage.SaveHandler → net.minecraft.world.chunk.storage.AnvilSaveHandler

## Class signature

```java
public class AnvilSaveHandler extends SaveHandler
```

## Constructors

- `AnvilSaveHandler(java.io.File savesDirectory, java.lang.String p_i2142_2_, boolean storePlayerdata)`

## Methods

- `void flush()` — Called to flush all changes to disk, waiting for them to complete.
- `IChunkLoader getChunkLoader(WorldProvider provider)` — initializes and returns the chunk loader for the specified world provider
- `void saveWorldInfoWithPlayer(WorldInfo worldInformation, NBTTagCompound tagCompound)` — Saves the given World Info with the given NBTTagCompound as the Player.
