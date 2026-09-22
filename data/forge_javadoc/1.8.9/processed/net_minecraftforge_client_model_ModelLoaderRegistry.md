# ModelLoaderRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.ModelLoaderRegistry

## Class signature

```java
public class ModelLoaderRegistry extends java.lang.Object
```

## Constructors

- `ModelLoaderRegistry()`

## Methods

- `static void clearModelCache()`
- `static ResourceLocation getActualLocation(ResourceLocation location)`
- `static IModel getMissingModel()`
- `static IModel getModel(ResourceLocation location)` — Primary method to get IModel instances.
- `static boolean loaded(ResourceLocation location)`
- `static void registerLoader(ICustomModelLoader loader)`