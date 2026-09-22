---
title: "ICustomModelLoader"
description: "public interface ICustomModelLoader extends ISelectiveResourceReloadListener"
package: "net/minecraftforge/client/model"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/ICustomModelLoader.html"
sourceType: javadoc
---

# ICustomModelLoader

## Class signature

```java
public interface ICustomModelLoader extends ISelectiveResourceReloadListener
```

## Methods

- `boolean accepts(ResourceLocation modelLocation)`
- `IModel loadModel(ResourceLocation modelLocation)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `default void onResourceManagerReload(IResourceManager resourceManager, java.util.function.Predicate<IResourceType> resourcePredicate)` — A version of onResourceManager that selectively chooses IResourceType s to reload.
