# FMLControlledNamespacedRegistry

**Inheritance:** java.lang.Object → net.minecraft.util.RegistrySimple<K, V> → net.minecraft.util.RegistryNamespaced<K, V> → net.minecraft.util.RegistryNamespacedDefaultedByKey<ResourceLocation, I> → net.minecraftforge.fml.common.registry.FMLControlledNamespacedRegistry<I>

## Class signature

```java
public class FMLControlledNamespacedRegistry<I> extends RegistryNamespacedDefaultedByKey<ResourceLocation, I>
```

## Methods

- `<T> FMLControlledNamespacedRegistry<T> asType(java.lang.Class<? extends T> type)`
- `void blockId(int id)`
- `boolean containsKey(ResourceLocation name)` — Does this registry contain an entry for the given key?
- `java.util.Set<? extends ResourceLocation> getActiveSubstitutions()`
- `I getDefaultValue()`
- `RegistryDelegate<I> getDelegate(I thing, java.lang.Class<I> clazz)`
- `RegistryDelegate.Delegate<I> getExistingDelegate(I thing)`
- `int getId(I thing)` — Get the id for the specified object.
- `int getId(ResourceLocation itemName)` — Get the id for the specified object.
- `ResourceLocation getNameForObject(I p_177774_1_)` — Gets the name we use to identify the given object.
- `I getObject(ResourceLocation name)` — Fetch the object identified by the specified name or the default object.
- `I getObjectById(int id)` — Gets the object identified by the given ID.
- `I getRaw(int id)` — Get the object identified by the specified id.
- `java.util.Iterator<I> iterator()`
- `void loadAliases(java.util.Map<ResourceLocation, ResourceLocation> aliases)`
- `void loadBlocked(java.util.Set<java.lang.Integer> blocked)`
- `void loadDummied(java.util.Set<ResourceLocation> dummied)`
- `void loadIds(java.util.Map<ResourceLocation, java.lang.Integer> ids, java.util.Map<ResourceLocation, java.lang.Integer> missingIds, java.util.Map<ResourceLocation, java.lang.Integer[]> remappedIds, FMLControlledNamespacedRegistry<I> currentRegistry, ResourceLocation registryName)`
- `void loadSubstitutions(java.util.Set<ResourceLocation> substitutions)`
- `void notifyCallbacks()`
- `@Deprecated void putObject(ResourceLocation name, I thing)`
- `@Deprecated void register(int id, ResourceLocation name, I thing)` — Deprecated. register through GameRegistry instead.
- `void serializeAliases(java.util.Map<ResourceLocation, ResourceLocation> map)`
- `void serializeBlockList(java.util.Set<java.lang.Integer> blocked)`
- `void serializeDummied(java.util.Set<ResourceLocation> set)`
- `void serializeIds(java.util.Map<ResourceLocation, java.lang.Integer> idMapping)`
- `void serializeSubstitutions(java.util.Set<ResourceLocation> set)`
- `java.lang.Iterable<I> typeSafeIterable()`
- `void validateKey()` — validates that this registry's key is non-null

## Fields

- `static boolean DEBUG`