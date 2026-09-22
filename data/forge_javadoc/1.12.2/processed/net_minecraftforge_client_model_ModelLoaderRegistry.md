# ModelLoaderRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ModelLoaderRegistry

## Class signature

```java
public class ModelLoaderRegistry extends java.lang.Object
```

## Constructors

- `ModelLoaderRegistry()`

## Methods

- `static void clearModelCache(IResourceManager manager)`
- `static ResourceLocation getActualLocation(ResourceLocation location)`
- `static IModel getMissingModel()`
- `static IModel getModel(ResourceLocation location)` — Primary method to get IModel instances.
- `static IModel getModelOrLogError(ResourceLocation location, java.lang.String error)` — Use this if you want the model, but need to log the error.
- `static IModel getModelOrMissing(ResourceLocation location)` — Use this if you don't care about the exception and want some model anyway.
- `static IAnimationStateMachine loadASM(ResourceLocation location, <any> customParameters)`
- `static boolean loaded(ResourceLocation location)`
- `static void registerLoader(ICustomModelLoader loader)`