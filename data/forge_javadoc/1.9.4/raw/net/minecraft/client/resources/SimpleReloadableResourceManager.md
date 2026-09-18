---
title: "SimpleReloadableResourceManager"
description: "public class SimpleReloadableResourceManager extends java.lang.Object implements IReloadableResourceManager"
package: "net/minecraft/client/resources"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/resources/SimpleReloadableResourceManager.html"
sourceType: javadoc
---

# SimpleReloadableResourceManager

## Class signature

```java
public class SimpleReloadableResourceManager extends java.lang.Object implements IReloadableResourceManager
```

## Constructors

- `public SimpleReloadableResourceManager( MetadataSerializer rmMetadataSerializerIn)`

## Methods

- `public void reloadResourcePack( IResourcePack resourcePack)`
- `public java.util.Set<java.lang.String> getResourceDomains()`
- `public IResource getResource( ResourceLocation location) throws java.io.IOException`
- `public java.util.List< IResource > getAllResources( ResourceLocation location) throws java.io.IOException`
- `public void reloadResources(java.util.List< IResourcePack > resourcesPacksList)`
- `public void registerReloadListener( IResourceManagerReloadListener reloadListener)`
