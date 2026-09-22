---
title: "ResourcePackRepository"
description: "public class ResourcePackRepository extends java.lang.Object"
package: "net/minecraft/client/resources"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/resources/ResourcePackRepository.html"
sourceType: javadoc
---

# ResourcePackRepository

**Inheritance:** java.lang.Object → net.minecraft.client.resources.ResourcePackRepository

## Class signature

```java
public class ResourcePackRepository extends java.lang.Object
```

## Constructors

- `ResourcePackRepository(java.io.File dirResourcepacksIn, java.io.File dirServerResourcepacksIn, IResourcePack rprDefaultResourcePackIn, IMetadataSerializer rprMetadataSerializerIn, GameSettings settings)`

## Methods

- `void clearResourcePack()`
- `<any> downloadResourcePack(java.lang.String url, java.lang.String hash)`
- `java.io.File getDirResourcepacks()`
- `java.util.List<ResourcePackRepository.Entry> getRepositoryEntries()`
- `java.util.List<ResourcePackRepository.Entry> getRepositoryEntriesAll()`
- `IResourcePack getResourcePackInstance()` — Getter for the IResourcePack instance associated with this ResourcePackRepository
- `void setRepositories(java.util.List<ResourcePackRepository.Entry> p_148527_1_)`
- `<any> setResourcePackInstance(java.io.File p_177319_1_)`
- `void updateRepositoryEntriesAll()`

## Fields

- `IResourcePack rprDefaultResourcePack`
- `IMetadataSerializer rprMetadataSerializer`
