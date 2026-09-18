---
title: "SearchTree"
description: "public class SearchTree<T> extends java.lang.Object implements ISearchTree <T>"
package: "net/minecraft/client/util"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/util/SearchTree.html"
sourceType: javadoc
---

# SearchTree

## Class signature

```java
public class SearchTree<T> extends java.lang.Object implements ISearchTree <T>
```

## Constructors

- `public SearchTree(java.util.function.Function< T ,java.lang.Iterable<java.lang.String>> nameFuncIn, java.util.function.Function< T ,java.lang.Iterable< ResourceLocation >> idFuncIn)`

## Methods

- `public void recalculate()`
- `public void add( T element)`
- `public java.util.List< T > search(java.lang.String searchText)`
