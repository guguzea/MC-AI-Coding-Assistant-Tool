---
title: "IResourcePack"
description: "public interface IResourcePack"
package: "net/minecraft/client/resources"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/resources/IResourcePack.html"
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
- `<T extends IMetadataSection > T getPackMetadata( MetadataSerializer metadataSerializer, java.lang.String metadataSectionName) throws java.io.IOException`
- `java.awt.image.BufferedImage getPackImage() throws java.io.IOException`
- `java.lang.String getPackName()`
