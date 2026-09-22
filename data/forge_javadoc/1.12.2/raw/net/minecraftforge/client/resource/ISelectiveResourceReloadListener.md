---
title: "ISelectiveResourceReloadListener"
description: "public interface ISelectiveResourceReloadListener extends IResourceManagerReloadListener"
package: "net/minecraftforge/client/resource"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/resource/ISelectiveResourceReloadListener.html"
sourceType: javadoc
---

# ISelectiveResourceReloadListener

## Class signature

```java
public interface ISelectiveResourceReloadListener extends IResourceManagerReloadListener
```

## Methods

- `default void onResourceManagerReload(IResourceManager resourceManager)`
- `void onResourceManagerReload(IResourceManager resourceManager, java.util.function.Predicate<IResourceType> resourcePredicate)` — A version of onResourceManager that selectively chooses IResourceType s to reload.
