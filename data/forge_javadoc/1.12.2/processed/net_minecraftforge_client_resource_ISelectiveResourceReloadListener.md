# ISelectiveResourceReloadListener

## Class signature

```java
public interface ISelectiveResourceReloadListener extends IResourceManagerReloadListener
```

## Methods

- `default void onResourceManagerReload(IResourceManager resourceManager)`
- `void onResourceManagerReload(IResourceManager resourceManager, java.util.function.Predicate<IResourceType> resourcePredicate)` — A version of onResourceManager that selectively chooses IResourceType s to reload.