---
title: "MapStorage"
description: "public class MapStorage extends java.lang.Object"
package: "net/minecraft/world/storage"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/storage/MapStorage.html"
sourceType: javadoc
---

# MapStorage

## Class signature

```java
public class MapStorage extends java.lang.Object
```

## Constructors

- `public MapStorage( ISaveHandler saveHandlerIn)`

## Methods

- `@Nullable public WorldSavedData getOrLoadData(java.lang.Class<? extends WorldSavedData > clazz, java.lang.String dataIdentifier)`
- `public void setData(java.lang.String dataIdentifier, WorldSavedData data)`
- `public void saveAllData()`
- `public int getUniqueDataId(java.lang.String key)`
