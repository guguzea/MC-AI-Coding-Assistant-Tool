---
title: "AbstractResourcePack"
description: "public abstract class AbstractResourcePack extends java.lang.Object implements IResourcePack"
package: "net/minecraft/client/resources"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/resources/AbstractResourcePack.html"
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
- `protected void logNameNotLowercase(java.lang.String p_110594_1_)`
- `public <T extends IMetadataSection > T getPackMetadata( IMetadataSerializer p_135058_1_, java.lang.String p_135058_2_) throws java.io.IOException`
- `public java.awt.image.BufferedImage getPackImage() throws java.io.IOException`
- `public java.lang.String getPackName()`
