---
title: "IResource"
description: "public interface IResource extends java.io.Closeable"
package: "net/minecraft/client/resources"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/resources/IResource.html"
sourceType: javadoc
---

# IResource

## Class signature

```java
public interface IResource extends java.io.Closeable
```

## Methods

- `ResourceLocation getResourceLocation()`
- `java.io.InputStream getInputStream()`
- `boolean hasMetadata()`
- `<T extends IMetadataSection > T getMetadata(java.lang.String sectionName)`
- `java.lang.String getResourcePackName()`
