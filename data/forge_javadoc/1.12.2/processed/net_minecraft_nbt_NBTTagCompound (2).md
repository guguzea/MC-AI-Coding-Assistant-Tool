# NBTTagCompound

## Class signature

```java
public class NBTTagCompound extends NBTBase
```

## Constructors

- `public NBTTagCompound()`

## Methods

- `public java.util.Set<java.lang.String> getKeySet()`
- `public byte getId()`
- `public int getSize()`
- `public void setTag(java.lang.String key, NBTBase value)`
- `public void setByte(java.lang.String key, byte value)`
- `public void setShort(java.lang.String key, short value)`
- `public void setInteger(java.lang.String key, int value)`
- `public void setLong(java.lang.String key, long value)`
- `public void setUniqueId(java.lang.String key, java.util.UUID value)`
- `public java.util.UUID getUniqueId(java.lang.String key)`
- `public boolean hasUniqueId(java.lang.String key)`
- `public void setFloat(java.lang.String key, float value)`
- `public void setDouble(java.lang.String key, double value)`
- `public void setString(java.lang.String key, java.lang.String value)`
- `public void setByteArray(java.lang.String key, byte[] value)`
- `public void setIntArray(java.lang.String key, int[] value)`
- `public void setBoolean(java.lang.String key, boolean value)`
- `public NBTBase getTag(java.lang.String key)`
- `public byte getTagId(java.lang.String key)`
- `public boolean hasKey(java.lang.String key)`
- `public boolean hasKey(java.lang.String key, int type)`
- `public byte getByte(java.lang.String key)`
- `public short getShort(java.lang.String key)`
- `public int getInteger(java.lang.String key)`
- `public long getLong(java.lang.String key)`
- `public float getFloat(java.lang.String key)`
- `public double getDouble(java.lang.String key)`
- `public java.lang.String getString(java.lang.String key)`
- `public byte[] getByteArray(java.lang.String key)`
- `public int[] getIntArray(java.lang.String key)`
- `public NBTTagCompound getCompoundTag(java.lang.String key)`
- `public NBTTagList getTagList(java.lang.String key, int type)`
- `public boolean getBoolean(java.lang.String key)`
- `public void removeTag(java.lang.String key)`
- `public java.lang.String toString()`
- `public boolean hasNoTags()`
- `public NBTTagCompound copy()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public void merge( NBTTagCompound other)`
- `protected static java.lang.String handleEscape(java.lang.String p_193582_0_)`