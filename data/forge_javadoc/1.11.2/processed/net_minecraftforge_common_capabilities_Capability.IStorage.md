# Capability.IStorage

## Class signature

```java
public static interface Capability.IStorage<T>
```

## Methods

- `void readNBT(Capability<T> capability, T instance, EnumFacing side, NBTBase nbt)` — Read the capability instance from a NBT tag.
- `NBTBase writeNBT(Capability<T> capability, T instance, EnumFacing side)` — Serialize the capability instance to a NBTTag.