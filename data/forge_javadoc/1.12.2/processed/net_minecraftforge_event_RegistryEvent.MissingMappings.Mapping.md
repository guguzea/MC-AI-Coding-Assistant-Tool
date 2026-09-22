# RegistryEvent.MissingMappings.Mapping

**Inheritance:** java.lang.Object → net.minecraftforge.event.RegistryEvent.MissingMappings.Mapping<T>

## Class signature

```java
public static class RegistryEvent.MissingMappings.Mapping<T extends IForgeRegistryEntry<T>> extends java.lang.Object
```

## Constructors

- `Mapping(IForgeRegistry<T> registry, IForgeRegistry<T> pool, ResourceLocation key, int id)`

## Methods

- `void fail()` — Prevent the world from loading due to the missing item.
- `RegistryEvent.MissingMappings.Action getAction()`
- `T getTarget()`
- `void ignore()` — Ignore the missing item.
- `void remap(T target)` — Remap the missing entry to the specified object.
- `void warn()` — Warn the user about the missing item.

## Fields

- `int id`
- `ResourceLocation key`
- `IForgeRegistry<T> registry`