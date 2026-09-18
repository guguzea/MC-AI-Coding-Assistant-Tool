---
title: "ResourcePackRepository"
description: "Getter for the IResourcePack instance associated with this ResourcePackRepository"
package: "net/minecraft/client/resources"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/resources/ResourcePackRepository.html"
sourceType: javadoc
---

# ResourcePackRepository

## Class signature

```java
public class ResourcePackRepository extends java.lang.Object
```

## Constructors

- `public ResourcePackRepository(java.io.File dirResourcepacksIn, java.io.File dirServerResourcepacksIn, IResourcePack rprDefaultResourcePackIn, IMetadataSerializer rprMetadataSerializerIn, GameSettings settings)`

## Methods

- `public void updateRepositoryEntriesAll()`
- `public java.util.List< ResourcePackRepository.Entry > getRepositoryEntriesAll()`
- `public java.util.List< ResourcePackRepository.Entry > getRepositoryEntries()`
- `public void setRepositories(java.util.List< ResourcePackRepository.Entry > p_148527_1_)`
- `public java.io.File getDirResourcepacks()`
- `public <any> downloadResourcePack(java.lang.String url, java.lang.String hash)`
- `public <any> setResourcePackInstance(java.io.File p_177319_1_)`
- `public IResourcePack getResourcePackInstance()`
- `public void clearResourcePack()`

## Description

Getter for the IResourcePack instance associated with this ResourcePackRepository
