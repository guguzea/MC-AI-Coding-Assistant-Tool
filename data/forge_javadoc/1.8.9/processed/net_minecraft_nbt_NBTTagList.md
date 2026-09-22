# NBTTagList

**Inheritance:** java.lang.Object → net.minecraft.nbt.NBTBase → net.minecraft.nbt.NBTTagList

## Class signature

```java
public class NBTTagList extends NBTBase
```

## Methods

- `void appendTag(NBTBase nbt)` — Adds the provided tag to the end of the list.
- `NBTBase copy()` — Creates a clone of the tag.
- `boolean equals(java.lang.Object p_equals_1_)`
- `NBTBase get(int idx)` — Get the tag at the given position
- `NBTTagCompound getCompoundTagAt(int i)` — Retrieves the NBTTagCompound at the specified index in the list
- `double getDoubleAt(int i)`
- `float getFloatAt(int i)`
- `byte getId()` — Gets the type byte for the tag.
- `int[] getIntArrayAt(int i)`
- `java.lang.String getStringTagAt(int i)` — Retrieves the tag String value at the specified index in the list
- `int getTagType()`
- `int hashCode()`
- `boolean hasNoTags()` — Return whether this compound has no tags.
- `NBTBase removeTag(int i)` — Removes a tag at the given index.
- `void set(int idx, NBTBase nbt)` — Set the given index to the given tag
- `int tagCount()` — Returns the number of tags in the list.
- `java.lang.String toString()`

## Fields

- `NBTTagList`