---
title: "IResource"
description: "public interface IResource extends java.io.Closeable"
package: "net/minecraft/client/resources"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/resources/IResource.html"
sourceType: javadoc
---

# IResource

## Class signature

```java
public interface IResource extends java.io.Closeable
```

## Methods

- `java.io.InputStream getInputStream()`
- `<T extends IMetadataSection> T getMetadata(java.lang.String sectionName)`
- `ResourceLocation getResourceLocation()`
- `java.lang.String getResourcePackName()`
- `boolean hasMetadata()`
