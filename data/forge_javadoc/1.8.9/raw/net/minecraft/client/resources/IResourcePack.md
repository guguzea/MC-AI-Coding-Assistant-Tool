---
title: "IResourcePack"
description: "public interface IResourcePack"
package: "net/minecraft/client/resources"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/resources/IResourcePack.html"
sourceType: javadoc
---

# IResourcePack

## Class signature

```java
public interface IResourcePack
```

## Methods

- `java.io.InputStream getInputStream(ResourceLocation location)`
- `java.awt.image.BufferedImage getPackImage()`
- `<T extends IMetadataSection> T getPackMetadata(IMetadataSerializer p_135058_1_, java.lang.String p_135058_2_)`
- `java.lang.String getPackName()`
- `java.util.Set<java.lang.String> getResourceDomains()`
- `boolean resourceExists(ResourceLocation location)`
