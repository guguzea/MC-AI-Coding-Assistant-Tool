---
title: "TopologicalSort.DirectedGraph"
description: "public static class TopologicalSort.DirectedGraph<T> extends java.lang.Object implements java.lang.Iterable<T>"
package: "net/minecraftforge/fml/common/toposort"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/toposort/TopologicalSort.DirectedGraph.html"
sourceType: javadoc
---

# TopologicalSort.DirectedGraph

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.toposort.TopologicalSort.DirectedGraph<T>

## Class signature

```java
public static class TopologicalSort.DirectedGraph<T> extends java.lang.Object implements java.lang.Iterable<T>
```

## Constructors

- `DirectedGraph()`

## Methods

- `void addEdge(T from, T to)`
- `boolean addNode(T node)`
- `boolean edgeExists(T from, T to)`
- `java.util.Set<T> edgesFrom(T from)`
- `boolean isEmpty()`
- `java.util.Iterator<T> iterator()`
- `void removeEdge(T from, T to)`
- `int size()`
- `java.lang.String toString()`
