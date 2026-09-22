# SearchTreeManager

**Inheritance:** java.lang.Object → net.minecraft.client.util.SearchTreeManager

## Class signature

```java
public class SearchTreeManager extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `SearchTreeManager()`

## Methods

- `<T> ISearchTree<T> get(SearchTreeManager.Key<T> key)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `<T> void register(SearchTreeManager.Key<T> key, SearchTree<T> searchTreeIn)`

## Fields

- `static SearchTreeManager.Key<ItemStack> ITEMS`
- `static SearchTreeManager.Key<RecipeList> RECIPES`