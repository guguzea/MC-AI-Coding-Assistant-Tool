---
title: "FallbackResourceManager"
description: "public class FallbackResourceManager extends java.lang.Object implements IResourceManager"
package: "net/minecraft/client/resources"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/resources/FallbackResourceManager.html"
sourceType: javadoc
---

# FallbackResourceManager

## Class signature

```java
public class FallbackResourceManager extends java.lang.Object implements IResourceManager
```

## Constructors

- `public FallbackResourceManager( IMetadataSerializer frmMetadataSerializerIn)`

## Methods

- `public void addResourcePack( IResourcePack resourcePack)`
- `public java.util.Set<java.lang.String> getResourceDomains()`
- `public IResource getResource( ResourceLocation location) throws java.io.IOException`
- `protected java.io.InputStream getInputStream( ResourceLocation location, IResourcePack resourcePack) throws java.io.IOException`
- `public java.util.List< IResource > getAllResources( ResourceLocation location) throws java.io.IOException`
