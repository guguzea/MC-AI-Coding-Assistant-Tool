---
title: "MapStorage"
description: "public class MapStorage extends java.lang.Object"
package: "net/minecraft/world/storage"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/MapStorage.html"
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
