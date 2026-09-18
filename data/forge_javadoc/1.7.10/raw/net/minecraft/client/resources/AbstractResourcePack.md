---
title: "AbstractResourcePack"
description: "public abstract class AbstractResourcePack extends java.lang.Object implements IResourcePack"
package: "net/minecraft/client/resources"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/resources/AbstractResourcePack.html"
sourceType: javadoc
---

# AbstractResourcePack

## Class signature

```java
public abstract class AbstractResourcePack extends java.lang.Object implements IResourcePack
```

## Constructors

- `public AbstractResourcePack(java.io.File p_i1287_1_)`

## Methods

- `protected static java.lang.String getRelativeName(java.io.File p_110595_0_, java.io.File p_110595_1_)`
- `public java.io.InputStream getInputStream( ResourceLocation p_110590_1_) throws java.io.IOException`
- `public boolean resourceExists( ResourceLocation p_110589_1_)`
- `protected abstract java.io.InputStream getInputStreamByName(java.lang.String p_110591_1_) throws java.io.IOException`
- `protected abstract boolean hasResourceName(java.lang.String p_110593_1_)`
- `protected void logNameNotLowercase(java.lang.String p_110594_1_)`
- `public IMetadataSection getPackMetadata( IMetadataSerializer p_135058_1_, java.lang.String p_135058_2_) throws java.io.IOException`
- `public java.awt.image.BufferedImage getPackImage() throws java.io.IOException`
- `public java.lang.String getPackName()`
