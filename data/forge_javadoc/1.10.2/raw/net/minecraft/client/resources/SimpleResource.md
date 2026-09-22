---
title: "SimpleResource"
description: "public class SimpleResource extends java.lang.Object implements IResource, java.io.Closeable"
package: "net/minecraft/client/resources"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/resources/SimpleResource.html"
sourceType: javadoc
---

# SimpleResource

**Inheritance:** java.lang.Object → net.minecraft.client.resources.SimpleResource

## Class signature

```java
public class SimpleResource extends java.lang.Object implements IResource, java.io.Closeable
```

## Constructors

- `SimpleResource(java.lang.String resourcePackNameIn, ResourceLocation srResourceLocationIn, java.io.InputStream resourceInputStreamIn, java.io.InputStream mcmetaInputStreamIn, MetadataSerializer srMetadataSerializerIn)`

## Methods

- `void close()`
- `boolean equals(java.lang.Object p_equals_1_)`
- `java.io.InputStream getInputStream()`
- `<T extends IMetadataSection> T getMetadata(java.lang.String sectionName)`
- `ResourceLocation getResourceLocation()`
- `java.lang.String getResourcePackName()`
- `int hashCode()`
- `boolean hasMetadata()`
