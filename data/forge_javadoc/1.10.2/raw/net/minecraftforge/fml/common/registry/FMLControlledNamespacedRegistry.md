---
title: "FMLControlledNamespacedRegistry"
description: "public class FMLControlledNamespacedRegistry<I extends IForgeRegistryEntry<I>> extends RegistryNamespacedDefaultedByKey<ResourceLocation, I> implements IForgeRegistry<I>"
package: "net/minecraftforge/fml/common/registry"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/registry/FMLControlledNamespacedRegistry.html"
sourceType: javadoc
---

# FMLControlledNamespacedRegistry

**Inheritance:** java.lang.Object → net.minecraft.util.registry.RegistrySimple<K, V> → net.minecraft.util.registry.RegistryNamespaced<K, V> → net.minecraft.util.registry.RegistryNamespacedDefaultedByKey<ResourceLocation, I> → net.minecraftforge.fml.common.registry.FMLControlledNamespacedRegistry<I>

## Class signature

```java
public class FMLControlledNamespacedRegistry<I extends IForgeRegistryEntry<I>> extends RegistryNamespacedDefaultedByKey<ResourceLocation, I> implements IForgeRegistry<I>
```

## Methods

- `<T extends IForgeRegistryEntry<T>> FMLControlledNamespacedRegistry<T> asType(java.lang.Class<? extends T> type)`
- `void blockId(int id)`
- `boolean containsKey(ResourceLocation name)` — Determine if the registry has an entry for the specified name.
- `boolean containsValue(I value)`
- `java.util.Set<? extends ResourceLocation> getActiveSubstitutions()`
- `I getDefaultValue()`
- `RegistryDelegate<I> getDelegate(I thing, java.lang.Class<I> clazz)`
- `java.util.Set<java.util.Map.Entry<ResourceLocation, I>> getEntries()`
- `int getId(I thing)` — Get the id for the specified object.
- `int getId(ResourceLocation itemName)` — Get the id for the specified object.
- `ResourceLocation getKey(I value)`
- `ResourceLocation getNameForObject(I p_177774_1_)`
- `I getObject(ResourceLocation name)` — Fetch the object identified by the specified name or the default object.
- `I getObjectById(int id)` — Fetch the object identified by the specified id or the default object.
- `I getRaw(int id)` — Get the object identified by the specified id.
- `java.lang.Class<I> getRegistrySuperType()`
- `<T> T getSlaveMap(ResourceLocation slaveMapName, java.lang.Class<T> type)` — Retrieve the slave map of type T from the registry.
- `I getValue(ResourceLocation key)`
- `java.util.List<I> getValues()`
- `boolean isDummied(ResourceLocation key)`
- `java.util.Iterator<I> iterator()`
- `void loadAliases(java.util.Map<ResourceLocation, ResourceLocation> aliases)`
- `void loadBlocked(java.util.Set<java.lang.Integer> blocked)`
- `void loadDummied(java.util.Set<ResourceLocation> dummied)`
- `void loadIds(java.util.Map<ResourceLocation, java.lang.Integer> ids, java.util.Map<ResourceLocation, java.lang.Integer> missingIds, java.util.Map<ResourceLocation, java.lang.Integer[]> remappedIds, FMLControlledNamespacedRegistry<I> currentRegistry, ResourceLocation registryName)`
- `void loadSubstitutions(java.util.Set<ResourceLocation> substitutions)`
- `void notifyCallbacks()`
- `@Deprecated void putObject(ResourceLocation name, I thing)` — Deprecated. register through GameRegistry instead.
- `void register(I value)`
- `@Deprecated void register(int id, ResourceLocation name, I thing)` — Deprecated. register through GameRegistry instead.
- `void registerAll(I ... values)`
- `void serializeAliases(java.util.Map<ResourceLocation, ResourceLocation> map)`
- `void serializeBlockList(java.util.Set<java.lang.Integer> blocked)`
- `void serializeDummied(java.util.Set<ResourceLocation> set)`
- `void serializeIds(java.util.Map<ResourceLocation, java.lang.Integer> idMapping)`
- `void serializeSubstitutions(java.util.Set<ResourceLocation> set)`
- `java.lang.Iterable<I> typeSafeIterable()`
- `void validateKey()`

## Fields

- `static boolean DEBUG`
