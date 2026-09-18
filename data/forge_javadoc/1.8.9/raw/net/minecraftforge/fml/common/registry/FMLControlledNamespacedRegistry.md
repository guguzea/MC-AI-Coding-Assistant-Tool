---
title: "FMLControlledNamespacedRegistry"
description: "Does this registry contain an entry for the given key?"
package: "net/minecraftforge/fml/common/registry"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/registry/FMLControlledNamespacedRegistry.html"
sourceType: javadoc
---

# FMLControlledNamespacedRegistry

## Class signature

```java
public class FMLControlledNamespacedRegistry<I> extends RegistryNamespacedDefaultedByKey < ResourceLocation ,I>
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
- `public RegistryDelegate.Delegate < I > getExistingDelegate( I thing)`
- `public void validateKey()`
- `public java.util.Iterator< I > iterator()`
- `public <T> FMLControlledNamespacedRegistry <T> asType(java.lang.Class<? extends T> type)`
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

## Description

Does this registry contain an entry for the given key?
