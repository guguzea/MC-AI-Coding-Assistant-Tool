---
title: "AnvilSaveHandler"
description: "Called to flush all changes to disk, waiting for them to complete."
package: "net/minecraft/world/chunk/storage"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/storage/AnvilSaveHandler.html"
sourceType: javadoc
---

# AnvilSaveHandler

## Class signature

```java
public class AnvilSaveHandler extends SaveHandler
```

## Constructors

- `public AnvilSaveHandler(java.io.File savesDirectory, java.lang.String p_i2142_2_, boolean storePlayerdata)`

## Methods

- `public IChunkLoader getChunkLoader( WorldProvider provider)`
- `public void saveWorldInfoWithPlayer( WorldInfo worldInformation, NBTTagCompound tagCompound)`
- `public void flush()`

## Description

Called to flush all changes to disk, waiting for them to complete.
