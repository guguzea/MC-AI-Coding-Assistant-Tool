# DataWatcher

**Inheritance:** java.lang.Object → net.minecraft.entity.DataWatcher

## Class signature

```java
public class DataWatcher extends java.lang.Object
```

## Constructors

- `DataWatcher(Entity p_i45313_1_)`

## Methods

- `void addObject(int p_75682_1_, java.lang.Object p_75682_2_)`
- `void addObjectByDataType(int p_82709_1_, int p_82709_2_)`
- `void func_111144_e()`
- `void func_151509_a(PacketBuffer p_151509_1_)`
- `java.util.List getAllWatched()`
- `java.util.List getChanged()`
- `boolean getIsBlank()`
- `byte getWatchableObjectByte(int p_75683_1_)`
- `float getWatchableObjectFloat(int p_111145_1_)`
- `int getWatchableObjectInt(int p_75679_1_)`
- `ItemStack getWatchableObjectItemStack(int p_82710_1_)`
- `short getWatchableObjectShort(int p_75693_1_)`
- `java.lang.String getWatchableObjectString(int p_75681_1_)`
- `boolean hasChanges()`
- `static java.util.List readWatchedListFromPacketBuffer(PacketBuffer p_151508_0_)`
- `void setObjectWatched(int p_82708_1_)`
- `void updateObject(int p_75692_1_, java.lang.Object p_75692_2_)`
- `void updateWatchedObjectsFromList(java.util.List p_75687_1_)`
- `static void writeWatchedListToPacketBuffer(java.util.List p_151507_0_, PacketBuffer p_151507_1_)`