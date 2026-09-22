# PersistentRegistryManager

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.PersistentRegistryManager

## Class signature

```java
public class PersistentRegistryManager extends java.lang.Object
```

## Constructors

- `PersistentRegistryManager()`

## Methods

- `@Deprecated static<T extends IForgeRegistryEntry<T>> FMLControlledNamespacedRegistry<T> createRegistry(ResourceLocation registryName, java.lang.Class<T> registryType, ResourceLocation optionalDefaultKey, int minId, int maxId, boolean hasDelegates, IForgeRegistry.AddCallback<T> addCallback, IForgeRegistry.ClearCallback<T> clearCallback, IForgeRegistry.CreateCallback<T> createCallback)`
- `@Deprecated static<T extends IForgeRegistryEntry<T>> FMLControlledNamespacedRegistry<T> createRegistry(ResourceLocation registryName, java.lang.Class<T> registryType, ResourceLocation optionalDefaultKey, int minId, int maxId, boolean hasDelegates, IForgeRegistry.AddCallback<T> addCallback, IForgeRegistry.ClearCallback<T> clearCallback, IForgeRegistry.CreateCallback<T> createCallback, IForgeRegistry.SubstitutionCallback<T> substitutionCallback)`
- `static void fireCreateRegistryEvents()`
- `static void fireRegistryEvents()`
- `static void freezeData()`
- `static void freezeVanilla()`
- `static java.util.List<java.lang.String> injectSnapshot(PersistentRegistryManager.GameDataSnapshot snapshot, boolean injectFrozenData, boolean isLocalWorld)`
- `static boolean isFrozen(FMLControlledNamespacedRegistry<?> registry)`
- `static<T extends IForgeRegistryEntry<T>> RegistryDelegate<T> makeDelegate(T obj, java.lang.Class<T> rootClass)`
- `static java.util.List<java.lang.String> processIdRematches(java.lang.Iterable<FMLMissingMappingsEvent.MissingMapping> missedMappings, boolean isLocalWorld, java.util.Map<ResourceLocation, java.lang.Integer> missingBlocks, java.util.Map<ResourceLocation, java.lang.Integer> missingItems, java.util.Map<ResourceLocation, java.lang.Integer[]> remapBlocks, java.util.Map<ResourceLocation, java.lang.Integer[]> remapItems)`
- `static void revertToFrozen()`
- `static PersistentRegistryManager.GameDataSnapshot takeSnapshot()`

## Fields

- `static ResourceLocation BIOMES`
- `static ResourceLocation BLOCKS`
- `static ResourceLocation ENCHANTMENTS`
- `static ResourceLocation ENTITIES`
- `static ResourceLocation ITEMS`
- `static ResourceLocation POTIONS`
- `static ResourceLocation POTIONTYPES`
- `static ResourceLocation SOUNDEVENTS`