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