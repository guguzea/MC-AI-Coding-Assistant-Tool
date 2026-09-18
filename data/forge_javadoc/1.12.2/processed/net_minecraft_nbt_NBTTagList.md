# NBTTagList

## Class signature

```java
public class NBTTagList extends NBTBase implements java.lang.Iterable< NBTBase >
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
- `public int getIntAt(int p_186858_1_)`
- `public int[] getIntArrayAt(int i)`
- `public double getDoubleAt(int i)`
- `public float getFloatAt(int i)`
- `public java.lang.String getStringTagAt(int i)`
- `public NBTBase get(int idx)`
- `public int tagCount()`
- `public NBTTagList copy()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public int getTagType()`
- `public java.util.Iterator< NBTBase > iterator()`