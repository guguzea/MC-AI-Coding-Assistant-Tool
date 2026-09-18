---
title: "SearchTreeManager"
description: "public class SearchTreeManager extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/util"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/util/SearchTreeManager.html"
sourceType: javadoc
---

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
