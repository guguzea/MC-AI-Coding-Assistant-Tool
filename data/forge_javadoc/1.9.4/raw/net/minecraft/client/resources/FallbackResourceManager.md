---
title: "FallbackResourceManager"
description: "public class FallbackResourceManager extends java.lang.Object implements IResourceManager"
package: "net/minecraft/client/resources"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/resources/FallbackResourceManager.html"
sourceType: javadoc
---

# FallbackResourceManager

**Inheritance:** java.lang.Object → net.minecraft.client.resources.FallbackResourceManager

## Class signature

```java
public class FallbackResourceManager extends java.lang.Object implements IResourceManager
```

## Constructors

- `FallbackResourceManager(MetadataSerializer frmMetadataSerializerIn)`

## Methods

- `void addResourcePack(IResourcePack resourcePack)`
- `java.util.List<IResource> getAllResources(ResourceLocation location)`
- `protected java.io.InputStream getInputStream(ResourceLocation location, IResourcePack resourcePack)`
- `IResource getResource(ResourceLocation location)`
- `java.util.Set<java.lang.String> getResourceDomains()`

## Fields

- `protected java.util.List<IResourcePack> resourcePacks`
