---
title: "TopologicalSort"
description: "public class TopologicalSort extends java.lang.Object"
package: "net/minecraftforge/fml/common/toposort"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/toposort/TopologicalSort.html"
sourceType: javadoc
---

# TopologicalSort

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.toposort.TopologicalSort

## Class signature

```java
public class TopologicalSort extends java.lang.Object
```

## Constructors

- `TopologicalSort()`

## Methods

- `static<T> void explore(T node, TopologicalSort.DirectedGraph<T> graph, java.util.List<T> sortedResult, java.util.Set<T> visitedNodes, java.util.Set<T> expandedNodes)`
- `static<T> TopologicalSort.DirectedGraph<T> reverse(TopologicalSort.DirectedGraph<T> graph)`
- `static<T> java.util.List<T> topologicalSort(TopologicalSort.DirectedGraph<T> graph)` — Sort the input graph into a topologically sorted list Uses the reverse depth first search as outlined in ...
