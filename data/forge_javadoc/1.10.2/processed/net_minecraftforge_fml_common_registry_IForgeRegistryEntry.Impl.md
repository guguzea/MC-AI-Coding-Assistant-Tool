# IForgeRegistryEntry.Impl

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<T>

## Class signature

```java
public static class IForgeRegistryEntry.Impl<T extends IForgeRegistryEntry<T>> extends java.lang.Object implements IForgeRegistryEntry<T>
```

## Constructors

- `Impl()`

## Methods

- `ResourceLocation getRegistryName()` — A unique identifier for this entry, if this entry is registered already it will return it's official registry name.
- `java.lang.Class<? super T> getRegistryType()`
- `T setRegistryName(ResourceLocation name)` — Sets a unique name for this Item.
- `T setRegistryName(java.lang.String name)`
- `T setRegistryName(java.lang.String modID, java.lang.String name)`

## Fields

- `RegistryDelegate<T> delegate`