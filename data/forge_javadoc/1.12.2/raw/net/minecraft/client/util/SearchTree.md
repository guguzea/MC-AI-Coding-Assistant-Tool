---
title: "SearchTree"
description: "public class SearchTree<T> extends java.lang.Object implements ISearchTree<T>"
package: "net/minecraft/client/util"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/util/SearchTree.html"
sourceType: javadoc
---

# SearchTree

**Inheritance:** java.lang.Object → net.minecraft.client.util.SearchTree<T>

## Class signature

```java
public class SearchTree<T> extends java.lang.Object implements ISearchTree<T>
```

## Constructors

- `SearchTree(java.util.function.Function<T, java.lang.Iterable<java.lang.String>> nameFuncIn, java.util.function.Function<T, java.lang.Iterable<ResourceLocation>> idFuncIn)`

## Methods

- `void add(T element)`
- `void recalculate()`
- `java.util.List<T> search(java.lang.String searchText)`

## Fields

- `protected SuffixArray<T> byId`
- `protected SuffixArray<T> byName`
