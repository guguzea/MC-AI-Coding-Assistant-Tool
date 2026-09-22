---
title: "MapStorage"
description: "public class MapStorage extends java.lang.Object"
package: "net/minecraft/world/storage"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/storage/MapStorage.html"
sourceType: javadoc
---

# MapStorage

**Inheritance:** java.lang.Object → net.minecraft.world.storage.MapStorage

## Class signature

```java
public class MapStorage extends java.lang.Object
```

## Constructors

- `MapStorage(ISaveHandler saveHandlerIn)`

## Methods

- `int getUniqueDataId(java.lang.String key)` — Returns an unique new data id for the given prefix and saves the idCounts map to the 'idcounts' file.
- `WorldSavedData loadData(java.lang.Class<? extends WorldSavedData> clazz, java.lang.String dataIdentifier)` — Loads an existing MapDataBase corresponding to the given String id from disk, instantiating the given Class, or returns null if none such file exists. args: Class to instantiate, String dataid
- `void saveAllData()` — Saves all dirty loaded MapDataBases to disk.
- `void setData(java.lang.String dataIdentifier, WorldSavedData data)` — Assigns the given String id to the given MapDataBase, removing any existing ones of the same id.

## Fields

- `protected java.util.Map<java.lang.String, WorldSavedData> loadedDataMap`
