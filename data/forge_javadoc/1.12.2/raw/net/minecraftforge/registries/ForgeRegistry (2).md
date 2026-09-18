---
title: "ForgeRegistry"
description: "Used to control the times where people can modify this registry."
package: "net/minecraftforge/registries"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/registries/ForgeRegistry.html"
sourceType: javadoc
---

# ForgeRegistry

## Class signature

```java
public class ForgeRegistry<V extends IForgeRegistryEntry <V>> extends java.lang.Object implements IForgeRegistryInternal <V>, IForgeRegistryModifiable <V>
```

## Methods

- `public void register( V value)`
- `public java.util.Iterator< V > iterator()`
- `public java.lang.Class< V > getRegistrySuperType()`
- `public void registerAll( V ... values)`
- `public boolean containsKey( ResourceLocation key)`
- `public boolean containsValue( V value)`
- `public V getValue( ResourceLocation key)`
- `public ResourceLocation getKey( V value)`
- `public java.util.Set< ResourceLocation > getKeys()`
- `@Deprecated public java.util.List< V > getValues()`
- `public java.util.Collection< V > getValuesCollection()`
- `public java.util.Set<java.util.Map.Entry< ResourceLocation , V >> getEntries()`
- `public <T> T getSlaveMap( ResourceLocation name, java.lang.Class<T> type)`
- `public void setSlaveMap( ResourceLocation name, java.lang.Object obj)`
- `public int getID( V value)`
- `public int getID( ResourceLocation name)`
- `public V getValue(int id)`
- `@Deprecated public V getRaw(int id)`
- `public void clear()`
- `public V remove( ResourceLocation key)`
- `public boolean isLocked()`
- `public void freeze()`
- `public void unfreeze()`
- `public void loadIds(java.util.Map< ResourceLocation ,java.lang.Integer> ids, java.util.Map< ResourceLocation ,java.lang.String> overrides, java.util.Map< ResourceLocation ,java.lang.Integer> missing, java.util.Map< ResourceLocation ,java.lang.Integer[]> remapped, ForgeRegistry < V > old, ResourceLocation name)`
- `public ForgeRegistry.Snapshot makeSnapshot()`
- `public RegistryEvent.MissingMappings <?> getMissingEvent( ResourceLocation name, java.util.Map< ResourceLocation ,java.lang.Integer> map)`

## Description

Used to control the times where people can modify this registry.
