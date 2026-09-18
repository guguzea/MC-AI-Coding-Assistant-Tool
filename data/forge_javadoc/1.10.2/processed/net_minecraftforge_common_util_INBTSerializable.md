# INBTSerializable

## Class signature

```java
public interface INBTSerializable<T extends NBTBase >
```

## Methods

- `T serializeNBT()`
- `void deserializeNBT( T nbt)`

## Description

An interface designed to unify various things in the Minecraft code base that can be serialized to and from a NBT tag.