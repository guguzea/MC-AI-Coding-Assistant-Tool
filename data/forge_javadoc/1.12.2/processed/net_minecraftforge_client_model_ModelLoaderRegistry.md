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
- `public static IAnimationStateMachine loadASM( ResourceLocation location, <any> customParameters)`

## Description

Primary method to get IModel instances.