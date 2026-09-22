---
title: "SearchTreeManager"
description: "public class SearchTreeManager extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/util"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/util/SearchTreeManager.html"
sourceType: javadoc
---

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
