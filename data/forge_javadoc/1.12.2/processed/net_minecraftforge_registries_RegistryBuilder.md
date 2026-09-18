# RegistryBuilder

## Class signature

```java
public class RegistryBuilder<T extends IForgeRegistryEntry <T>> extends java.lang.Object
```

## Constructors

- `public RegistryBuilder()`

## Methods

- `public RegistryBuilder < T > setName( ResourceLocation name)`
- `public RegistryBuilder < T > setType(java.lang.Class< T > type)`
- `public RegistryBuilder < T > setIDRange(int min, int max)`
- `public RegistryBuilder < T > setMaxID(int max)`
- `public RegistryBuilder < T > setDefaultKey( ResourceLocation key)`
- `public RegistryBuilder < T > addCallback(java.lang.Object inst)`
- `public RegistryBuilder < T > add( IForgeRegistry.AddCallback < T > add)`
- `public RegistryBuilder < T > add( IForgeRegistry.ClearCallback < T > clear)`
- `public RegistryBuilder < T > add( IForgeRegistry.CreateCallback < T > create)`
- `public RegistryBuilder < T > add( IForgeRegistry.ValidateCallback < T > validate)`
- `public RegistryBuilder < T > set( IForgeRegistry.DummyFactory < T > factory)`
- `public RegistryBuilder < T > set( IForgeRegistry.MissingFactory < T > missing)`
- `public RegistryBuilder < T > disableSaving()`
- `public RegistryBuilder < T > disableOverrides()`
- `public RegistryBuilder < T > allowModification()`
- `public IForgeRegistry < T > create()`