---
title: "FMLControlledNamespacedRegistry"
description: "Deprecated. register through GameRegistry instead."
package: "cpw/mods/fml/common/registry"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/registry/FMLControlledNamespacedRegistry.html"
sourceType: javadoc
---

# FMLControlledNamespacedRegistry

## Class signature

```java
public class FMLControlledNamespacedRegistry<I> extends RegistryNamespaced
```

## Methods

- `@Deprecated public void addObject(int id, java.lang.String name, java.lang.Object thing)`
- `@Deprecated public void putObject(java.lang.Object objName, java.lang.Object obj)`
- `public I getObject(java.lang.String name)`
- `public I getObjectById(int id)`
- `@Deprecated public I get(int id)`
- `@Deprecated public I get(java.lang.String name)`
- `public int getId( I thing)`
- `public I getRaw(int id)`
- `public I getRaw(java.lang.String name)`
- `public boolean containsKey(java.lang.String name)`
- `public int getId(java.lang.String itemName)`
- `@Deprecated public boolean contains(java.lang.String itemName)`
- `public java.lang.Iterable< I > typeSafeIterable()`
- `public void serializeInto(java.util.Map<java.lang.String,java.lang.Integer> idMapping)`
- `public java.util.Map<java.lang.String,java.lang.String> getAliases()`
- `public I getDefaultValue()`
- `public RegistryDelegate < I > getDelegate( I thing, java.lang.Class< I > clazz)`
- `public void serializeSubstitutions(java.util.Set<java.lang.String> blockSubs)`
- `public java.util.Iterator< I > iterator()`

## Description

Deprecated. register through GameRegistry instead.
