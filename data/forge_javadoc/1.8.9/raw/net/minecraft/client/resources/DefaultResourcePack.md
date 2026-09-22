---
title: "DefaultResourcePack"
description: "public class DefaultResourcePack extends java.lang.Object implements IResourcePack"
package: "net/minecraft/client/resources"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/resources/DefaultResourcePack.html"
sourceType: javadoc
---

# DefaultResourcePack

**Inheritance:** java.lang.Object → net.minecraft.client.resources.DefaultResourcePack

## Class signature

```java
public class DefaultResourcePack extends java.lang.Object implements IResourcePack
```

## Constructors

- `DefaultResourcePack(java.util.Map<java.lang.String, java.io.File> mapAssetsIn)`

## Methods

- `java.io.InputStream getInputStream(ResourceLocation location)`
- `java.io.InputStream getInputStreamAssets(ResourceLocation location)`
- `java.awt.image.BufferedImage getPackImage()`
- `<T extends IMetadataSection> T getPackMetadata(IMetadataSerializer p_135058_1_, java.lang.String p_135058_2_)`
- `java.lang.String getPackName()`
- `java.util.Set<java.lang.String> getResourceDomains()`
- `boolean resourceExists(ResourceLocation location)`

## Fields

- `static java.util.Set<java.lang.String> defaultResourceDomains`
