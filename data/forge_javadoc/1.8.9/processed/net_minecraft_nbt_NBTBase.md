# NBTBase

**Inheritance:** java.lang.Object → net.minecraft.nbt.NBTBase

## Class signature

```java
public abstract class NBTBase extends java.lang.Object
```

## Constructors

- `NBTBase()`

## Methods

- `abstract NBTBase copy()` — Creates a clone of the tag.
- `protected static NBTBase createNewByType(byte id)` — Creates a new NBTBase object that corresponds with the passed in id.
- `boolean equals(java.lang.Object p_equals_1_)`
- `abstract byte getId()` — Gets the type byte for the tag.
- `protected java.lang.String getString()`
- `int hashCode()`
- `boolean hasNoTags()` — Return whether this compound has no tags.
- `abstract java.lang.String toString()`

## Fields

- `static java.lang.String[] NBT_TYPES`