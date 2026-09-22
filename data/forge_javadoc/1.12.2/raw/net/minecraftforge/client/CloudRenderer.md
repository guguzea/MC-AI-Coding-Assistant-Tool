---
title: "CloudRenderer"
description: "public class CloudRenderer extends java.lang.Object implements ISelectiveResourceReloadListener"
package: "net/minecraftforge/client"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/CloudRenderer.html"
sourceType: javadoc
---

# CloudRenderer

**Inheritance:** java.lang.Object → net.minecraftforge.client.CloudRenderer

## Class signature

```java
public class CloudRenderer extends java.lang.Object implements ISelectiveResourceReloadListener
```

## Constructors

- `CloudRenderer()`

## Methods

- `void checkSettings()`
- `void onResourceManagerReload(IResourceManager resourceManager, java.util.function.Predicate<IResourceType> resourcePredicate)` — A version of onResourceManager that selectively chooses IResourceType s to reload.
- `boolean render(int cloudTicks, float partialTicks)`
