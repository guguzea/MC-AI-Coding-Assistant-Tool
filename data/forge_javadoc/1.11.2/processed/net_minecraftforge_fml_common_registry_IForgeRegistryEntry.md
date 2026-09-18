# IForgeRegistryEntry

## Class signature

```java
public interface IForgeRegistryEntry<V>
```

## Methods

- `V setRegistryName( ResourceLocation name)`
- `@Nullable ResourceLocation getRegistryName()`
- `java.lang.Class<? super V > getRegistryType()`

## Description

A unique identifier for this entry, if this entry is registered already it will return it's official registry name.