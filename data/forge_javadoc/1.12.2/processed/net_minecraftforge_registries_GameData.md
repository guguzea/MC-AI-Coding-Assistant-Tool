# GameData

## Class signature

```java
public class GameData extends java.lang.Object
```

## Constructors

- `public GameData()`

## Methods

- `public static void init()`
- `public static <V extends IForgeRegistryEntry <V>> RegistryNamespacedDefaultedByKey < ResourceLocation ,V> getWrapperDefaulted(java.lang.Class<V> cls)`
- `public static <V extends IForgeRegistryEntry <V>> RegistryNamespaced < ResourceLocation ,V> getWrapper(java.lang.Class<V> cls)`
- `public static <any> getBlockItemMap()`
- `public static ObjectIntIdentityMap < IBlockState > getBlockStateIDMap()`
- `public static java.util.Map<java.lang.Class<? extends Entity >, EntityEntry > getEntityClassMap()`
- `public static java.util.Map< DataSerializer <?>, DataSerializerEntry > getSerializerMap()`
- `public static <K extends IForgeRegistryEntry <K>> K register_impl(K value)`
- `public static void vanillaSnapshot()`
- `public static void freezeData()`
- `public static void revertToFrozen()`
- `public static void revert( RegistryManager state, ResourceLocation registry, boolean lock)`
- `public static ForgeRegistry < EntityEntry > getEntityRegistry()`
- `public static void registerEntity(int id, ResourceLocation key, java.lang.Class<? extends Entity > clazz, java.lang.String oldName)`
- `public static <any> injectSnapshot(java.util.Map< ResourceLocation , ForgeRegistry.Snapshot > snapshot, boolean injectFrozenData, boolean isLocalWorld)`
- `public static void fireCreateRegistryEvents()`
- `public static void fireRegistryEvents()`
- `public static void fireRegistryEvents(java.util.function.Predicate< ResourceLocation > filter)`
- `@Deprecated public static ResourceLocation checkPrefix(java.lang.String name)`
- `public static ResourceLocation checkPrefix(java.lang.String name, boolean warnOverrides)`

## Description

INTERNAL ONLY MODDERS SHOULD HAVE NO REASON TO USE THIS CLASS