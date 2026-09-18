---
title: "AbstractResourcePack"
description: "public abstract class AbstractResourcePack extends java.lang.Object implements IResourcePack"
package: "net/minecraft/client/resources"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/resources/AbstractResourcePack.html"
sourceType: javadoc
---

# AbstractResourcePack

## Class signature

```java
public abstract class AbstractResourcePack extends java.lang.Object implements IResourcePack
```

## Constructors

- `public AbstractResourcePack(java.io.File resourcePackFileIn)`

## Methods

- `protected static java.lang.String getRelativeName(java.io.File p_110595_0_, java.io.File p_110595_1_)`
- `public java.io.InputStream getInputStream( ResourceLocation location) throws java.io.IOException`
- `public boolean resourceExists( ResourceLocation location)`
- `protected abstract java.io.InputStream getInputStreamByName(java.lang.String name) throws java.io.IOException`
- `protected abstract boolean hasResourceName(java.lang.String name)`
- `protected void logNameNotLowercase(java.lang.String name)`
- `public <T extends IMetadataSection > T getPackMetadata( MetadataSerializer metadataSerializer, java.lang.String metadataSectionName) throws java.io.IOException`
- `public java.awt.image.BufferedImage getPackImage() throws java.io.IOException`
- `public java.lang.String getPackName()`
