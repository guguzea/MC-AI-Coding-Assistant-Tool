---
title: "SaveDataMemoryStorage"
description: "public class SaveDataMemoryStorage extends MapStorage"
package: "net/minecraft/world/storage"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/SaveDataMemoryStorage.html"
sourceType: javadoc
---

# SaveDataMemoryStorage

## Class signature

```java
public class SaveDataMemoryStorage extends MapStorage
```

## Constructors

- `public SaveDataMemoryStorage()`

## Methods

- `@Nullable public WorldSavedData getOrLoadData(java.lang.Class<? extends WorldSavedData > clazz, java.lang.String dataIdentifier)`
- `public void setData(java.lang.String dataIdentifier, WorldSavedData data)`
- `public void saveAllData()`
- `public int getUniqueDataId(java.lang.String key)`
