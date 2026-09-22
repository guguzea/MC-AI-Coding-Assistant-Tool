---
title: "MapStorage"
description: "public class MapStorage extends java.lang.Object"
package: "net/minecraft/world/storage"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/MapStorage.html"
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

- `WorldSavedData getOrLoadData(java.lang.Class<? extends WorldSavedData> clazz, java.lang.String dataIdentifier)`
- `int getUniqueDataId(java.lang.String key)`
- `void saveAllData()`
- `void setData(java.lang.String dataIdentifier, WorldSavedData data)`

## Fields

- `protected java.util.Map<java.lang.String, WorldSavedData> loadedDataMap`
