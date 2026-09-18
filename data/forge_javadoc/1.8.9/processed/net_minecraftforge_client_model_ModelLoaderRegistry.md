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