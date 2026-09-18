---
title: "ResourcePackRepository"
description: "public class ResourcePackRepository extends java.lang.Object"
package: "net/minecraft/client/resources"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/resources/ResourcePackRepository.html"
sourceType: javadoc
---

# ResourcePackRepository

## Class signature

```java
public class ResourcePackRepository extends java.lang.Object
```

## Constructors

- `public ResourcePackRepository(java.io.File dirResourcepacksIn, java.io.File dirServerResourcepacksIn, IResourcePack rprDefaultResourcePackIn, MetadataSerializer rprMetadataSerializerIn, GameSettings settings)`

## Methods

- `public static java.util.Map<java.lang.String,java.lang.String> getDownloadHeaders()`
- `public void updateRepositoryEntriesAll()`
- `public ResourcePackRepository.Entry getResourcePackEntry()`
- `public java.util.List< ResourcePackRepository.Entry > getRepositoryEntriesAll()`
- `public java.util.List< ResourcePackRepository.Entry > getRepositoryEntries()`
- `public void setRepositories(java.util.List< ResourcePackRepository.Entry > repositories)`
- `public java.io.File getDirResourcepacks()`
- `public <any> downloadResourcePack(java.lang.String url, java.lang.String hash)`
- `public <any> setServerResourcePack(java.io.File resourceFile)`
- `public IResourcePack getServerResourcePack()`
- `public void clearResourcePack()`
