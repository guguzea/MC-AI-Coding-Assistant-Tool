---
title: "CloudRenderer"
description: "A version of onResourceManager that selectively chooses IResourceType s to reload."
package: "net/minecraftforge/client"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/CloudRenderer.html"
sourceType: javadoc
---

# CloudRenderer

## Class signature

```java
public class CloudRenderer extends java.lang.Object implements ISelectiveResourceReloadListener
```

## Constructors

- `public CloudRenderer()`

## Methods

- `public void checkSettings()`
- `public boolean render(int cloudTicks, float partialTicks)`
- `public void onResourceManagerReload( IResourceManager resourceManager, java.util.function.Predicate< IResourceType > resourcePredicate)`

## Description

A version of onResourceManager that selectively chooses IResourceType s to reload.
