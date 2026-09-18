# PersistentRegistryManager

## Class signature

```java
public class PersistentRegistryManager extends java.lang.Object
```

## Constructors

- `public PersistentRegistryManager()`

## Methods

- `public static void fireCreateRegistryEvents()`
- `public static void fireRegistryEvents()`
- `@Deprecated public static <T extends IForgeRegistryEntry <T>> FMLControlledNamespacedRegistry <T> createRegistry( ResourceLocation registryName, java.lang.Class<T> registryType, ResourceLocation optionalDefaultKey, int minId, int maxId, boolean hasDelegates, @Nullable IForgeRegistry.AddCallback <T> addCallback, @Nullable IForgeRegistry.ClearCallback <T> clearCallback, @Nullable IForgeRegistry.CreateCallback <T> createCallback)`
- `@Deprecated public static <T extends IForgeRegistryEntry <T>> FMLControlledNamespacedRegistry <T> createRegistry( ResourceLocation registryName, java.lang.Class<T> registryType, @Nullable ResourceLocation optionalDefaultKey, int minId, int maxId, boolean hasDelegates, @Nullable IForgeRegistry.AddCallback <T> addCallback, @Nullable IForgeRegistry.ClearCallback <T> clearCallback, @Nullable IForgeRegistry.CreateCallback <T> createCallback, @Nullable IForgeRegistry.SubstitutionCallback <T> substitutionCallback)`
- `public static java.util.List<java.lang.String> injectSnapshot( PersistentRegistryManager.GameDataSnapshot snapshot, boolean injectFrozenData, boolean isLocalWorld)`
- `public static boolean isFrozen( FMLControlledNamespacedRegistry <?> registry)`
- `public static void revertToFrozen()`
- `public static void freezeData()`
- `public static void freezeVanilla()`
- `public static java.util.List<java.lang.String> processIdRematches(java.lang.Iterable< FMLMissingMappingsEvent.MissingMapping > missedMappings, boolean isLocalWorld, java.util.Map< ResourceLocation ,java.lang.Integer> missingBlocks, java.util.Map< ResourceLocation ,java.lang.Integer> missingItems, java.util.Map< ResourceLocation ,java.lang.Integer[]> remapBlocks, java.util.Map< ResourceLocation ,java.lang.Integer[]> remapItems)`
- `public static PersistentRegistryManager.GameDataSnapshot takeSnapshot()`
- `public static <T extends IForgeRegistryEntry <T>> RegistryDelegate <T> makeDelegate(T obj, java.lang.Class<T> rootClass)`

## Description

Persistent registry manager. Manages the registries loading from disk, and from network. Handles staging registry data before loading uniformly into the active registry, and keeps a frozen registry in