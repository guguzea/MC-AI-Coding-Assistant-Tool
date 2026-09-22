---
title: "NBTTagCompound"
description: "public class NBTTagCompound extends NBTBase"
package: "net/minecraft/nbt"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/nbt/NBTTagCompound.html"
sourceType: javadoc
---

# NBTTagCompound

**Inheritance:** java.lang.Object → net.minecraft.nbt.NBTBase → net.minecraft.nbt.NBTTagCompound

## Class signature

```java
public class NBTTagCompound extends NBTBase
```

## Methods

- `NBTBase copy()` — Creates a clone of the tag.
- `boolean equals(java.lang.Object p_equals_1_)`
- `boolean getBoolean(java.lang.String key)` — Retrieves a boolean value using the specified key, or false if no such key was stored.
- `byte getByte(java.lang.String key)` — Retrieves a byte value using the specified key, or 0 if no such key was stored.
- `byte[] getByteArray(java.lang.String key)` — Retrieves a byte array using the specified key, or a zero-length array if no such key was stored.
- `NBTTagCompound getCompoundTag(java.lang.String key)` — Retrieves a NBTTagCompound subtag matching the specified key, or a new empty NBTTagCompound if no such key was stored.
- `double getDouble(java.lang.String key)` — Retrieves a double value using the specified key, or 0 if no such key was stored.
- `float getFloat(java.lang.String key)` — Retrieves a float value using the specified key, or 0 if no such key was stored.
- `byte getId()` — Gets the type byte for the tag.
- `int[] getIntArray(java.lang.String key)` — Retrieves an int array using the specified key, or a zero-length array if no such key was stored.
- `int getInteger(java.lang.String key)` — Retrieves an integer value using the specified key, or 0 if no such key was stored.
- `java.util.Set<java.lang.String> getKeySet()`
- `long getLong(java.lang.String key)` — Retrieves a long value using the specified key, or 0 if no such key was stored.
- `short getShort(java.lang.String key)` — Retrieves a short value using the specified key, or 0 if no such key was stored.
- `java.lang.String getString(java.lang.String key)` — Retrieves a string value using the specified key, or an empty string if no such key was stored.
- `NBTBase getTag(java.lang.String key)` — gets a generic tag with the specified name
- `byte getTagId(java.lang.String key)` — Gets the ID byte for the given tag key
- `NBTTagList getTagList(java.lang.String key, int type)` — Gets the NBTTagList object with the given name.
- `int hashCode()`
- `boolean hasKey(java.lang.String key)` — Returns whether the given string has been previously stored as a key in the map.
- `boolean hasKey(java.lang.String key, int type)`
- `boolean hasNoTags()` — Return whether this compound has no tags.
- `void merge(NBTTagCompound other)` — Merges this NBTTagCompound with the given compound.
- `void removeTag(java.lang.String key)` — Remove the specified tag.
- `void setBoolean(java.lang.String key, boolean value)` — Stores the given boolean value as a NBTTagByte, storing 1 for true and 0 for false, using the given string key.
- `void setByte(java.lang.String key, byte value)` — Stores a new NBTTagByte with the given byte value into the map with the given string key.
- `void setByteArray(java.lang.String key, byte[] value)` — Stores a new NBTTagByteArray with the given array as data into the map with the given string key.
- `void setDouble(java.lang.String key, double value)` — Stores a new NBTTagDouble with the given double value into the map with the given string key.
- `void setFloat(java.lang.String key, float value)` — Stores a new NBTTagFloat with the given float value into the map with the given string key.
- `void setIntArray(java.lang.String key, int[] value)` — Stores a new NBTTagIntArray with the given array as data into the map with the given string key.
- `void setInteger(java.lang.String key, int value)` — Stores a new NBTTagInt with the given integer value into the map with the given string key.
- `void setLong(java.lang.String key, long value)` — Stores a new NBTTagLong with the given long value into the map with the given string key.
- `void setShort(java.lang.String key, short value)` — Stores a new NBTTagShort with the given short value into the map with the given string key.
- `void setString(java.lang.String key, java.lang.String value)` — Stores a new NBTTagString with the given string value into the map with the given string key.
- `void setTag(java.lang.String key, NBTBase value)` — Stores the given tag into the map with the given string key.
- `java.lang.String toString()`

## Fields

- `NBTTagCompound`
