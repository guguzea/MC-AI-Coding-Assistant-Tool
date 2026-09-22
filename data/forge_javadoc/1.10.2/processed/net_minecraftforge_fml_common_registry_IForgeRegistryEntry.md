# IForgeRegistryEntry

## Class signature

```java
public interface IForgeRegistryEntry<V>
```

## Methods

- `ResourceLocation getRegistryName()` — A unique identifier for this entry, if this entry is registered already it will return it's official registry name.
- `java.lang.Class<? super V> getRegistryType()`
- `V setRegistryName(ResourceLocation name)` — Sets a unique name for this Item.