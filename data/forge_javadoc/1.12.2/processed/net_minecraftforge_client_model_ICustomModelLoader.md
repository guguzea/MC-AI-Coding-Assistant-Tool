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