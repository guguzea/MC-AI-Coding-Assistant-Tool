---
title: "IResourcePack"
description: "public interface IResourcePack"
package: "net/minecraft/client/resources"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/resources/IResourcePack.html"
sourceType: javadoc
---

# IResourcePack

## Class signature

```java
public interface IResourcePack
```

## Methods

- `java.io.InputStream getInputStream( ResourceLocation location) throws java.io.IOException`
- `boolean resourceExists( ResourceLocation location)`
- `java.util.Set<java.lang.String> getResourceDomains()`
- `@Nullable <T extends IMetadataSection > T getPackMetadata( MetadataSerializer metadataSerializer, java.lang.String metadataSectionName) throws java.io.IOException`
- `java.awt.image.BufferedImage getPackImage() throws java.io.IOException`
- `java.lang.String getPackName()`
