---
title: "ModelLoaderRegistry"
description: "Primary method to get IModel instances."
package: "net/minecraftforge/client/model"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/ModelLoaderRegistry.html"
sourceType: javadoc
---

# ModelLoaderRegistry

## Class signature

```java
public class ModelLoaderRegistry extends java.lang.Object
```

## Constructors

- `public ModelLoaderRegistry()`

## Methods

- `public static void registerLoader( ICustomModelLoader loader)`
- `public static boolean loaded( ResourceLocation location)`
- `public static ResourceLocation getActualLocation( ResourceLocation location)`
- `public static IModel getModel( ResourceLocation location) throws java.io.IOException`
- `public static IModel getMissingModel()`
- `public static void clearModelCache()`

## Description

Primary method to get IModel instances.
