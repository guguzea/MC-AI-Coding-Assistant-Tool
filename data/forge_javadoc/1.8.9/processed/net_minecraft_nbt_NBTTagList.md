# NBTTagList

## Class signature

```java
public class NBTTagList extends NBTBase
```

## Constructors

- `public NBTTagList()`

## Methods

- `public byte getId()`
- `public java.lang.String toString()`
- `public void appendTag( NBTBase nbt)`
- `public void set(int idx, NBTBase nbt)`
- `public NBTBase removeTag(int i)`
- `public boolean hasNoTags()`
- `public NBTTagCompound getCompoundTagAt(int i)`
- `public int[] getIntArrayAt(int i)`
- `public double getDoubleAt(int i)`
- `public float getFloatAt(int i)`
- `public java.lang.String getStringTagAt(int i)`
- `public NBTBase get(int idx)`
- `public int tagCount()`
- `public NBTBase copy()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public int getTagType()`

## Description

Adds the provided tag to the end of the list.