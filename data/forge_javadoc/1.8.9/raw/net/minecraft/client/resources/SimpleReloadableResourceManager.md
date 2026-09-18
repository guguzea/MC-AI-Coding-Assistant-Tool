---
title: "SimpleReloadableResourceManager"
description: "public class SimpleReloadableResourceManager extends java.lang.Object implements IReloadableResourceManager"
package: "net/minecraft/client/resources"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/resources/SimpleReloadableResourceManager.html"
sourceType: javadoc
---

# SimpleReloadableResourceManager

## Class signature

```java
public class SimpleReloadableResourceManager extends java.lang.Object implements IReloadableResourceManager
```

## Constructors

- `public SimpleReloadableResourceManager( IMetadataSerializer rmMetadataSerializerIn)`

## Methods

- `public void reloadResourcePack( IResourcePack resourcePack)`
- `public java.util.Set<java.lang.String> getResourceDomains()`
- `public IResource getResource( ResourceLocation location) throws java.io.IOException`
- `public java.util.List< IResource > getAllResources( ResourceLocation location) throws java.io.IOException`
- `public void reloadResources(java.util.List< IResourcePack > p_110541_1_)`
- `public void registerReloadListener( IResourceManagerReloadListener reloadListener)`
