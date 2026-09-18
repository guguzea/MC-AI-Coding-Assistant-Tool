---
title: "FMLControlledNamespacedRegistry"
description: "Determine if the registry has an entry for the specified name."
package: "net/minecraftforge/fml/common/registry"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/registry/FMLControlledNamespacedRegistry.html"
sourceType: javadoc
---

# FMLControlledNamespacedRegistry

## Class signature

```java
public class FMLControlledNamespacedRegistry<I extends IForgeRegistryEntry <I>> extends RegistryNamespacedDefaultedByKey < ResourceLocation ,I> implements IForgeRegistry <I>
```

## Methods

- `@Deprecated public void register(int id, ResourceLocation name, I thing)`
- `@Deprecated public void putObject( ResourceLocation name, I thing)`
- `public I getObject( ResourceLocation name)`
- `public I getObjectById(int id)`
- `public int getId( I thing)`
- `public I getRaw(int id)`
- `public boolean containsKey( ResourceLocation name)`
- `public int getId( ResourceLocation itemName)`
- `public java.lang.Iterable< I > typeSafeIterable()`
- `public void serializeIds(java.util.Map< ResourceLocation ,java.lang.Integer> idMapping)`
- `public void serializeAliases(java.util.Map< ResourceLocation , ResourceLocation > map)`
- `public void serializeSubstitutions(java.util.Set< ResourceLocation > set)`
- `public void serializeDummied(java.util.Set< ResourceLocation > set)`
- `public I getDefaultValue()`
- `public RegistryDelegate < I > getDelegate( I thing, java.lang.Class< I > clazz)`
- `public void validateKey()`
- `public java.util.Iterator< I > iterator()`
- `public <T extends IForgeRegistryEntry <T>> FMLControlledNamespacedRegistry <T> asType(java.lang.Class<? extends T> type)`
- `public void serializeBlockList(java.util.Set<java.lang.Integer> blocked)`
- `public java.util.Set<? extends ResourceLocation > getActiveSubstitutions()`
- `public void loadAliases(java.util.Map< ResourceLocation , ResourceLocation > aliases)`
- `public void loadSubstitutions(java.util.Set< ResourceLocation > substitutions)`
- `public void loadBlocked(java.util.Set<java.lang.Integer> blocked)`
- `public void loadDummied(java.util.Set< ResourceLocation > dummied)`
- `public void loadIds(java.util.Map< ResourceLocation ,java.lang.Integer> ids, java.util.Map< ResourceLocation ,java.lang.Integer> missingIds, java.util.Map< ResourceLocation ,java.lang.Integer[]> remappedIds, FMLControlledNamespacedRegistry < I > currentRegistry, ResourceLocation registryName)`
- `public void blockId(int id)`
- `public void notifyCallbacks()`
- `public ResourceLocation getNameForObject( I p_177774_1_)`
- `public java.lang.Class< I > getRegistrySuperType()`
- `public void register( I value)`
- `public boolean containsValue( I value)`
- `public I getValue( ResourceLocation key)`
- `public ResourceLocation getKey( I value)`
- `public java.util.List< I > getValues()`
- `public java.util.Set<java.util.Map.Entry< ResourceLocation , I >> getEntries()`
- `public <T> T getSlaveMap( ResourceLocation slaveMapName, java.lang.Class<T> type)`

## Description

Determine if the registry has an entry for the specified name.
