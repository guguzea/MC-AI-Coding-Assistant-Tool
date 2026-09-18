---
title: "DefaultResourcePack"
description: "public class DefaultResourcePack extends java.lang.Object implements IResourcePack"
package: "net/minecraft/client/resources"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/resources/DefaultResourcePack.html"
sourceType: javadoc
---

# DefaultResourcePack

## Class signature

```java
public class DefaultResourcePack extends java.lang.Object implements IResourcePack
```

## Constructors

- `public DefaultResourcePack(java.util.Map<java.lang.String,java.io.File> mapAssetsIn)`

## Methods

- `public java.io.InputStream getInputStream( ResourceLocation location) throws java.io.IOException`
- `public java.io.InputStream getInputStreamAssets( ResourceLocation location) throws java.io.IOException, java.io.FileNotFoundException`
- `public boolean resourceExists( ResourceLocation location)`
- `public java.util.Set<java.lang.String> getResourceDomains()`
- `public <T extends IMetadataSection > T getPackMetadata( IMetadataSerializer p_135058_1_, java.lang.String p_135058_2_) throws java.io.IOException`
- `public java.awt.image.BufferedImage getPackImage() throws java.io.IOException`
- `public java.lang.String getPackName()`
