# ICustomModelLoader

## Class signature

```java
public interface ICustomModelLoader extends ISelectiveResourceReloadListener
```

## Methods

- `void onResourceManagerReload( IResourceManager resourceManager)`
- `default void onResourceManagerReload( IResourceManager resourceManager, java.util.function.Predicate< IResourceType > resourcePredicate)`
- `boolean accepts( ResourceLocation modelLocation)`
- `IModel loadModel( ResourceLocation modelLocation) throws java.lang.Exception`

## Description

A version of onResourceManager that selectively chooses IResourceType s to reload.