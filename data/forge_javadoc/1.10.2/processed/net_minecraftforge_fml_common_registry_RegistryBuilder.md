# RegistryBuilder

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.RegistryBuilder<T>

## Class signature

```java
public class RegistryBuilder<T extends IForgeRegistryEntry<T>> extends java.lang.Object
```

## Constructors

- `RegistryBuilder()`

## Methods

- `RegistryBuilder<T> add(IForgeRegistry.AddCallback<T> add)`
- `RegistryBuilder<T> add(IForgeRegistry.ClearCallback<T> clear)`
- `RegistryBuilder<T> add(IForgeRegistry.CreateCallback<T> create)`
- `RegistryBuilder<T> add(IForgeRegistry.SubstitutionCallback<T> sub)`
- `RegistryBuilder<T> addCallback(java.lang.Object inst)`
- `IForgeRegistry<T> create()`
- `RegistryBuilder<T> setIDRange(int min, int max)`
- `RegistryBuilder<T> setName(ResourceLocation name)`
- `RegistryBuilder<T> setType(java.lang.Class<T> type)`