# DataWatcher

**Inheritance:** java.lang.Object → net.minecraft.entity.DataWatcher

## Class signature

```java
public class DataWatcher extends java.lang.Object
```

## Constructors

- `DataWatcher(Entity owner)`

## Methods

- `<T> void addObject(int id, T object)`
- `void addObjectByDataType(int id, int type)` — Add a new object for the DataWatcher to watch, using the specified data type.
- `void func_111144_e()`
- `java.util.List<DataWatcher.WatchableObject> getAllWatched()`
- `java.util.List<DataWatcher.WatchableObject> getChanged()`
- `boolean getIsBlank()`
- `byte getWatchableObjectByte(int id)` — gets the bytevalue of a watchable object
- `float getWatchableObjectFloat(int id)`
- `int getWatchableObjectInt(int id)` — gets a watchable object and returns it as a Integer
- `ItemStack getWatchableObjectItemStack(int id)` — Get a watchable object as an ItemStack.
- `Rotations getWatchableObjectRotations(int id)`
- `short getWatchableObjectShort(int id)`
- `java.lang.String getWatchableObjectString(int id)` — gets a watchable object and returns it as a String
- `boolean hasObjectChanged()` — true if one or more object was changed
- `static java.util.List<DataWatcher.WatchableObject> readWatchedListFromPacketBuffer(PacketBuffer buffer)`
- `void setObjectWatched(int id)`
- `<T> void updateObject(int id, T newData)`
- `void updateWatchedObjectsFromList(java.util.List<DataWatcher.WatchableObject> p_75687_1_)`
- `void writeTo(PacketBuffer buffer)`
- `static void writeWatchedListToPacketBuffer(java.util.List<DataWatcher.WatchableObject> objectsList, PacketBuffer buffer)` — Writes the list of watched objects (entity attribute of type {byte, short, int, float, string, ItemStack, ChunkCoordinates}) to the specified PacketBuffer