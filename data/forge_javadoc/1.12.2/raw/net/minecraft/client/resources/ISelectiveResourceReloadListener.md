---
title: "ISelectiveResourceReloadListener"
description: "A version of onResourceManager that selectively chooses IResourceType s to reload."
package: "net/minecraft/client/resources"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/resource/ISelectiveResourceReloadListener.html"
sourceType: javadoc
---

# ISelectiveResourceReloadListener

## Class signature

```java
public interface ISelectiveResourceReloadListener extends IResourceManagerReloadListener
```

## Methods

- `default void onResourceManagerReload( IResourceManager resourceManager)`
- `void onResourceManagerReload( IResourceManager resourceManager, java.util.function.Predicate< IResourceType > resourcePredicate)`

## Description

A version of onResourceManager that selectively chooses IResourceType s to reload.
