---
title: "ModSortingException"
description: "public class ModSortingException extends EnhancedRuntimeException"
package: "net/minecraftforge/fml/common/toposort"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/toposort/ModSortingException.html"
sourceType: javadoc
---

# ModSortingException

**Inheritance:** java.lang.Object → java.lang.Throwable → java.lang.Exception → java.lang.RuntimeException → net.minecraftforge.fml.common.EnhancedRuntimeException → net.minecraftforge.fml.common.toposort.ModSortingException

## Class signature

```java
public class ModSortingException extends EnhancedRuntimeException
```

## Constructors

- `ModSortingException(java.lang.String string, T node, java.util.Set<T> visitedNodes)`

## Methods

- `<T> ModSortingException.SortingExceptionData<T> getExceptionData()`
- `protected void printStackTrace(EnhancedRuntimeException.WrappedPrintStream stream)`
