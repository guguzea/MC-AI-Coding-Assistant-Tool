---
title: "LegacyV2Adapter"
description: "public class LegacyV2Adapter extends java.lang.Object implements IResourcePack"
package: "net/minecraft/client/resources"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/resources/LegacyV2Adapter.html"
sourceType: javadoc
---

# LegacyV2Adapter

## Class signature

```java
public class LegacyV2Adapter extends java.lang.Object implements IResourcePack
```

## Constructors

- `public LegacyV2Adapter( IResourcePack packIn)`

## Methods

- `public java.io.InputStream getInputStream( ResourceLocation location) throws java.io.IOException`
- `public boolean resourceExists( ResourceLocation location)`
- `public java.util.Set<java.lang.String> getResourceDomains()`
- `@Nullable public <T extends IMetadataSection > T getPackMetadata( MetadataSerializer metadataSerializer, java.lang.String metadataSectionName) throws java.io.IOException`
- `public java.awt.image.BufferedImage getPackImage() throws java.io.IOException`
- `public java.lang.String getPackName()`
