# DataWatcher

## Class signature

```java
public class DataWatcher extends java.lang.Object
```

## Constructors

- `public DataWatcher( Entity owner)`

## Methods

- `public <T> void addObject(int id, T object)`
- `public void addObjectByDataType(int id, int type)`
- `public byte getWatchableObjectByte(int id)`
- `public short getWatchableObjectShort(int id)`
- `public int getWatchableObjectInt(int id)`
- `public float getWatchableObjectFloat(int id)`
- `public java.lang.String getWatchableObjectString(int id)`
- `public ItemStack getWatchableObjectItemStack(int id)`
- `public Rotations getWatchableObjectRotations(int id)`
- `public <T> void updateObject(int id, T newData)`
- `public void setObjectWatched(int id)`
- `public boolean hasObjectChanged()`
- `public static void writeWatchedListToPacketBuffer(java.util.List< DataWatcher.WatchableObject > objectsList, PacketBuffer buffer) throws java.io.IOException`
- `public java.util.List< DataWatcher.WatchableObject > getChanged()`
- `public void writeTo( PacketBuffer buffer) throws java.io.IOException`
- `public java.util.List< DataWatcher.WatchableObject > getAllWatched()`
- `public static java.util.List< DataWatcher.WatchableObject > readWatchedListFromPacketBuffer( PacketBuffer buffer) throws java.io.IOException`
- `public void updateWatchedObjectsFromList(java.util.List< DataWatcher.WatchableObject > p_75687_1_)`
- `public boolean getIsBlank()`
- `public void func_111144_e()`

## Description

Add a new object for the DataWatcher to watch, using the specified data type.