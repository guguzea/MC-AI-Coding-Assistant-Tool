# EntityDataManager.DataEntry

**Inheritance:** java.lang.Object → net.minecraft.network.datasync.EntityDataManager.DataEntry<T>

## Class signature

```java
public static class EntityDataManager.DataEntry<T> extends java.lang.Object
```

## Constructors

- `DataEntry(DataParameter<T> keyIn, T valueIn)`

## Methods

- `DataParameter<T> getKey()`
- `T getValue()`
- `boolean isDirty()`
- `void setDirty(boolean dirtyIn)`
- `void setValue(T valueIn)`