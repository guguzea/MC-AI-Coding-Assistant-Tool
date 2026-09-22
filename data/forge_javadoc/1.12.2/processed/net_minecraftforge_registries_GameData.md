# GameData

**Inheritance:** java.lang.Object → net.minecraftforge.registries.GameData

## Class signature

```java
public class GameData extends java.lang.Object
```

## Constructors

- `GameData()`

## Methods

- `@Deprecated static ResourceLocation checkPrefix(java.lang.String name)` — Deprecated. Use checkPrefix(String, boolean) .
- `static ResourceLocation checkPrefix(java.lang.String name, boolean warnOverrides)` — Check a name for a domain prefix, and if not present infer it from the current active mod container.
- `static void fireCreateRegistryEvents()`
- `static void fireRegistryEvents()`
- `static void fireRegistryEvents(java.util.function.Predicate<ResourceLocation> filter)`
- `static void freezeData()`
- `static<any> getBlockItemMap()`
- `static ObjectIntIdentityMap<IBlockState> getBlockStateIDMap()`
- `static java.util.Map<java.lang.Class<? extends Entity>, EntityEntry> getEntityClassMap()`
- `static ForgeRegistry<EntityEntry> getEntityRegistry()`
- `static java.util.Map<DataSerializer<?>, DataSerializerEntry> getSerializerMap()`
- `static<V extends IForgeRegistryEntry<V>> RegistryNamespaced<ResourceLocation, V> getWrapper(java.lang.Class<V> cls)`
- `static<V extends IForgeRegistryEntry<V>> RegistryNamespacedDefaultedByKey<ResourceLocation, V> getWrapperDefaulted(java.lang.Class<V> cls)`
- `static void init()`
- `static<any> injectSnapshot(java.util.Map<ResourceLocation, ForgeRegistry.Snapshot> snapshot, boolean injectFrozenData, boolean isLocalWorld)`
- `static<K extends IForgeRegistryEntry<K>> K register_impl(K value)`
- `static void registerEntity(int id, ResourceLocation key, java.lang.Class<? extends Entity> clazz, java.lang.String oldName)`
- `static void revert(RegistryManager state, ResourceLocation registry, boolean lock)`
- `static void revertToFrozen()`
- `static void vanillaSnapshot()`

## Fields

- `static ResourceLocation BIOMES`
- `static ResourceLocation BLOCKS`
- `static ResourceLocation ENCHANTMENTS`
- `static ResourceLocation ENTITIES`
- `static ResourceLocation ITEMS`
- `static ResourceLocation POTIONS`
- `static ResourceLocation POTIONTYPES`
- `static ResourceLocation PROFESSIONS`
- `static ResourceLocation RECIPES`
- `static ResourceLocation SERIALIZERS`
- `static ResourceLocation SOUNDEVENTS`