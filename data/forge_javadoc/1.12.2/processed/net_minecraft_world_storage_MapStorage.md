# MapStorage

## Class signature

```java
public class MapStorage extends java.lang.Object
```

## Constructors

- `public MapStorage( ISaveHandler saveHandlerIn)`

## Methods

- `public WorldSavedData getOrLoadData(java.lang.Class<? extends WorldSavedData > clazz, java.lang.String dataIdentifier)`
- `public void setData(java.lang.String dataIdentifier, WorldSavedData data)`
- `public void saveAllData()`
- `public int getUniqueDataId(java.lang.String key)`