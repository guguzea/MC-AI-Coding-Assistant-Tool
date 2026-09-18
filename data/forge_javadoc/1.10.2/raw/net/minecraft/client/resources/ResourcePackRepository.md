---
title: "ResourcePackRepository"
description: "public class ResourcePackRepository extends java.lang.Object"
package: "net/minecraft/client/resources"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/resources/ResourcePackRepository.html"
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
- `@Nullable public ResourcePackRepository.Entry getResourcePackEntry()`
- `public java.util.List< ResourcePackRepository.Entry > getRepositoryEntriesAll()`
- `public java.util.List< ResourcePackRepository.Entry > getRepositoryEntries()`
- `public void setRepositories(java.util.List< ResourcePackRepository.Entry > repositories)`
- `public java.io.File getDirResourcepacks()`
- `public com.google.common.util.concurrent.ListenableFuture<java.lang.Object> downloadResourcePack(java.lang.String url, java.lang.String hash)`
- `public com.google.common.util.concurrent.ListenableFuture<java.lang.Object> setResourcePackInstance(java.io.File resourceFile)`
- `public IResourcePack getResourcePackInstance()`
- `public void clearResourcePack()`
