# RegistryManager

**Inheritance:** java.lang.Object → net.minecraftforge.registries.RegistryManager

## Class signature

```java
public class RegistryManager extends java.lang.Object
```

## Constructors

- `RegistryManager(java.lang.String name)`

## Methods

- `void clean()`
- `java.lang.String getName()`
- `<V extends IForgeRegistryEntry<V>> ResourceLocation getName(IForgeRegistry<V> reg)`
- `<V extends IForgeRegistryEntry<V>> IForgeRegistry<V> getRegistry(java.lang.Class<V> cls)`
- `<V extends IForgeRegistryEntry<V>> ForgeRegistry<V> getRegistry(ResourceLocation key)`
- `<V extends IForgeRegistryEntry<V>> ForgeRegistry<V> getRegistry(ResourceLocation key, RegistryManager other)`
- `<V extends IForgeRegistryEntry<V>> java.lang.Class<V> getSuperType(ResourceLocation key)`
- `java.util.Map<ResourceLocation, ForgeRegistry.Snapshot> takeSnapshot(boolean savingToDisc)`

## Fields

- `static RegistryManager ACTIVE`
- `static RegistryManager FROZEN`
- `static RegistryManager VANILLA`