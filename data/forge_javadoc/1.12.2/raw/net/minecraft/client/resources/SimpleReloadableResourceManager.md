---
title: "SimpleReloadableResourceManager"
description: "public class SimpleReloadableResourceManager extends java.lang.Object implements IReloadableResourceManager"
package: "net/minecraft/client/resources"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/resources/SimpleReloadableResourceManager.html"
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
