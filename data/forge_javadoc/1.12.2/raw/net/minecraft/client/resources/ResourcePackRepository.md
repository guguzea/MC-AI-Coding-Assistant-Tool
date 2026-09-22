---
title: "ResourcePackRepository"
description: "public class ResourcePackRepository extends java.lang.Object"
package: "net/minecraft/client/resources"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/resources/ResourcePackRepository.html"
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
- `<any> downloadResourcePack(java.lang.String url, java.lang.String hash)`
- `java.io.File getDirResourcepacks()`
- `static java.util.Map<java.lang.String, java.lang.String> getDownloadHeaders()`
- `java.util.List<ResourcePackRepository.Entry> getRepositoryEntries()`
- `java.util.List<ResourcePackRepository.Entry> getRepositoryEntriesAll()`
- `ResourcePackRepository.Entry getResourcePackEntry()`
- `IResourcePack getServerResourcePack()`
- `void setRepositories(java.util.List<ResourcePackRepository.Entry> repositories)`
- `<any> setServerResourcePack(java.io.File resourceFile)`
- `void updateRepositoryEntriesAll()`

## Fields

- `IResourcePack rprDefaultResourcePack`
- `MetadataSerializer rprMetadataSerializer`
