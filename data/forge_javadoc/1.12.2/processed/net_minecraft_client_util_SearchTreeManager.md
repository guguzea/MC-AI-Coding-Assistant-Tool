# SearchTreeManager

## Class signature

```java
public class SearchTreeManager extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `public SearchTreeManager()`

## Methods

- `public void onResourceManagerReload( IResourceManager resourceManager)`
- `public <T> void register( SearchTreeManager.Key <T> key, SearchTree <T> searchTreeIn)`
- `public <T> ISearchTree <T> get( SearchTreeManager.Key <T> key)`