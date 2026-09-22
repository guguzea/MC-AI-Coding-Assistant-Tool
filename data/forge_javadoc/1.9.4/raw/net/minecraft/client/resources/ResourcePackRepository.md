---
title: "ResourcePackRepository"
description: "public class ResourcePackRepository extends java.lang.Object"
package: "net/minecraft/client/resources"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/resources/ResourcePackRepository.html"
sourceType: javadoc
---

# ResourcePackRepository

**Inheritance:** java.lang.Object → net.minecraft.client.resources.ResourcePackRepository

## Class signature

```java
public class ResourcePackRepository extends java.lang.Object
```

## Constructors

- `ResourcePackRepository(java.io.File dirResourcepacksIn, java.io.File dirServerResourcepacksIn, IResourcePack rprDefaultResourcePackIn, MetadataSerializer rprMetadataSerializerIn, GameSettings settings)`

## Methods

- `void clearResourcePack()`
- `com.google.common.util.concurrent.ListenableFuture<java.lang.Object> downloadResourcePack(java.lang.String url, java.lang.String hash)`
- `java.io.File getDirResourcepacks()`
- `java.util.List<ResourcePackRepository.Entry> getRepositoryEntries()`
- `java.util.List<ResourcePackRepository.Entry> getRepositoryEntriesAll()`
- `ResourcePackRepository.Entry getResourcePackEntry()`
- `IResourcePack getResourcePackInstance()`
- `void setRepositories(java.util.List<ResourcePackRepository.Entry> repositories)`
- `com.google.common.util.concurrent.ListenableFuture<java.lang.Object> setResourcePackInstance(java.io.File resourceFile)`
- `void updateRepositoryEntriesAll()`

## Fields

- `IResourcePack rprDefaultResourcePack`
- `MetadataSerializer rprMetadataSerializer`
