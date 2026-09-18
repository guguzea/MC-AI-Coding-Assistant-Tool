# RegistryManager

## Class signature

```java
public class RegistryManager extends java.lang.Object
```

## Constructors

- `public RegistryManager(java.lang.String name)`

## Methods

- `public java.lang.String getName()`
- `public <V extends IForgeRegistryEntry <V>> java.lang.Class<V> getSuperType( ResourceLocation key)`
- `public <V extends IForgeRegistryEntry <V>> ForgeRegistry <V> getRegistry( ResourceLocation key)`
- `public <V extends IForgeRegistryEntry <V>> IForgeRegistry <V> getRegistry(java.lang.Class<V> cls)`
- `public <V extends IForgeRegistryEntry <V>> ResourceLocation getName( IForgeRegistry <V> reg)`
- `public <V extends IForgeRegistryEntry <V>> ForgeRegistry <V> getRegistry( ResourceLocation key, RegistryManager other)`
- `public java.util.Map< ResourceLocation , ForgeRegistry.Snapshot > takeSnapshot(boolean savingToDisc)`
- `public void clean()`