---
title: "DefaultResourcePack"
description: "public class DefaultResourcePack extends java.lang.Object implements IResourcePack"
package: "net/minecraft/client/resources"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/resources/DefaultResourcePack.html"
sourceType: javadoc
---

# DefaultResourcePack

**Inheritance:** java.lang.Object → net.minecraft.client.resources.DefaultResourcePack

## Class signature

```java
public class DefaultResourcePack extends java.lang.Object implements IResourcePack
```

## Constructors

- `DefaultResourcePack(ResourceIndex resourceIndexIn)`

## Methods

- `java.io.InputStream getInputStream(ResourceLocation location)`
- `java.io.InputStream getInputStreamAssets(ResourceLocation location)`
- `java.awt.image.BufferedImage getPackImage()`
- `<T extends IMetadataSection> T getPackMetadata(MetadataSerializer metadataSerializer, java.lang.String metadataSectionName)`
- `java.lang.String getPackName()`
- `java.util.Set<java.lang.String> getResourceDomains()`
- `boolean resourceExists(ResourceLocation location)`

## Fields

- `static java.util.Set<java.lang.String> DEFAULT_RESOURCE_DOMAINS`
