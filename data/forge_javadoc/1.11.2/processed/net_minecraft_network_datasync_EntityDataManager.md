# EntityDataManager

## Class signature

```java
public class EntityDataManager extends java.lang.Object
```

## Constructors

- `public EntityDataManager( Entity entityIn)`

## Methods

- `public static <T> DataParameter <T> createKey(java.lang.Class<? extends Entity > clazz, DataSerializer <T> serializer)`
- `public <T> void register( DataParameter <T> key, T value)`
- `public <T> T get( DataParameter <T> key)`
- `public <T> void set( DataParameter <T> key, T value)`
- `public <T> void setDirty( DataParameter <T> key)`
- `public boolean isDirty()`
- `public static void writeEntries(java.util.List< EntityDataManager.DataEntry <?>> entriesIn, PacketBuffer buf) throws java.io.IOException`
- `@Nullable public java.util.List< EntityDataManager.DataEntry <?>> getDirty()`
- `public void writeEntries( PacketBuffer buf) throws java.io.IOException`
- `@Nullable public java.util.List< EntityDataManager.DataEntry <?>> getAll()`
- `@Nullable public static java.util.List< EntityDataManager.DataEntry <?>> readEntries( PacketBuffer buf) throws java.io.IOException`
- `public void setEntryValues(java.util.List< EntityDataManager.DataEntry <?>> entriesIn)`
- `protected <T> void setEntryValue( EntityDataManager.DataEntry <T> target, EntityDataManager.DataEntry <?> source)`
- `public boolean isEmpty()`
- `public void setClean()`