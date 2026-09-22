---
title: "IResource"
description: "public interface IResource extends java.io.Closeable"
package: "net/minecraft/client/resources"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/resources/IResource.html"
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
