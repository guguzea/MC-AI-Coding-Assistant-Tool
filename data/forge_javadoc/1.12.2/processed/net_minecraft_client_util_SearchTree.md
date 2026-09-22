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