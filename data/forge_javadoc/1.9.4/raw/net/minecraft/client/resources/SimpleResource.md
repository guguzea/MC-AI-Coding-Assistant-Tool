---
title: "SimpleResource"
description: "public class SimpleResource extends java.lang.Object implements IResource , java.io.Closeable"
package: "net/minecraft/client/resources"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/resources/SimpleResource.html"
sourceType: javadoc
---

# SimpleResource

## Class signature

```java
public class SimpleResource extends java.lang.Object implements IResource , java.io.Closeable
```

## Constructors

- `public SimpleResource(java.lang.String resourcePackNameIn, ResourceLocation srResourceLocationIn, java.io.InputStream resourceInputStreamIn, java.io.InputStream mcmetaInputStreamIn, MetadataSerializer srMetadataSerializerIn)`

## Methods

- `public ResourceLocation getResourceLocation()`
- `public java.io.InputStream getInputStream()`
- `public boolean hasMetadata()`
- `@Nullable public <T extends IMetadataSection > T getMetadata(java.lang.String sectionName)`
- `public java.lang.String getResourcePackName()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public void close() throws java.io.IOException`
