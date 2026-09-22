---
title: "SimpleReloadableResourceManager"
description: "public class SimpleReloadableResourceManager extends java.lang.Object implements IReloadableResourceManager"
package: "net/minecraft/client/resources"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/resources/SimpleReloadableResourceManager.html"
sourceType: javadoc
---

# SimpleReloadableResourceManager

**Inheritance:** java.lang.Object → net.minecraft.client.resources.SimpleReloadableResourceManager

## Class signature

```java
public class SimpleReloadableResourceManager extends java.lang.Object implements IReloadableResourceManager
```

## Constructors

- `SimpleReloadableResourceManager(IMetadataSerializer rmMetadataSerializerIn)`

## Methods

- `java.util.List<IResource> getAllResources(ResourceLocation location)`
- `IResource getResource(ResourceLocation location)`
- `java.util.Set<java.lang.String> getResourceDomains()`
- `void registerReloadListener(IResourceManagerReloadListener reloadListener)`
- `void reloadResourcePack(IResourcePack resourcePack)`
- `void reloadResources(java.util.List<IResourcePack> p_110541_1_)`
