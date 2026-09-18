---
title: "TopologicalSort"
description: "Topological sort for mod loading Based on a variety of sources, including http://keithschwarz.com/interesting/code/?dir=topological-sort"
package: "net/minecraftforge/fml/common/toposort"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/toposort/TopologicalSort.html"
sourceType: javadoc
---

# TopologicalSort

## Class signature

```java
public class TopologicalSort extends java.lang.Object
```

## Constructors

- `public TopologicalSort()`

## Methods

- `public static <T> java.util.List<T> topologicalSort( TopologicalSort.DirectedGraph <T> graph)`
- `public static <T> TopologicalSort.DirectedGraph <T> reverse( TopologicalSort.DirectedGraph <T> graph)`
- `public static <T> void explore(T node, TopologicalSort.DirectedGraph <T> graph, java.util.List<T> sortedResult, java.util.Set<T> visitedNodes, java.util.Set<T> expandedNodes)`

## Description

Topological sort for mod loading Based on a variety of sources, including http://keithschwarz.com/interesting/code/?dir=topological-sort
