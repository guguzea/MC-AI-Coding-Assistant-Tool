# MapStorage

## Class signature

```java
public class MapStorage extends java.lang.Object
```

## Constructors

- `public MapStorage( ISaveHandler saveHandlerIn)`

## Methods

- `public WorldSavedData loadData(java.lang.Class<? extends WorldSavedData > clazz, java.lang.String dataIdentifier)`
- `public void setData(java.lang.String dataIdentifier, WorldSavedData data)`
- `public void saveAllData()`
- `public int getUniqueDataId(java.lang.String key)`

## Description

Returns an unique new data id for the given prefix and saves the idCounts map to the 'idcounts' file.