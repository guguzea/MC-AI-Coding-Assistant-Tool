---
title: "ModelLoaderRegistry"
description: "Primary method to get IModel instances."
package: "net/minecraftforge/client/model"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/model/ModelLoaderRegistry.html"
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
- `public static IModel getModel( ResourceLocation location) throws java.lang.Exception`
- `public static IModel getModelOrMissing( ResourceLocation location)`
- `public static IModel getModelOrLogError( ResourceLocation location, java.lang.String error)`
- `public static IModel getMissingModel()`
- `public static void clearModelCache( IResourceManager manager)`
- `public static IAnimationStateMachine loadASM( ResourceLocation location, com.google.common.collect.ImmutableMap<java.lang.String, ITimeValue > customParameters)`

## Description

Primary method to get IModel instances.
