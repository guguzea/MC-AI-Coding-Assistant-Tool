---
title: "ModSortingException"
description: "public class ModSortingException extends EnhancedRuntimeException implements IDisplayableError"
package: "net/minecraftforge/fml/common/toposort"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/toposort/ModSortingException.html"
sourceType: javadoc
---

# ModSortingException

**Inheritance:** java.lang.Object → java.lang.Throwable → java.lang.Exception → java.lang.RuntimeException → net.minecraftforge.fml.common.EnhancedRuntimeException → net.minecraftforge.fml.common.toposort.ModSortingException

## Class signature

```java
public class ModSortingException extends EnhancedRuntimeException implements IDisplayableError
```

## Constructors

- `ModSortingException(java.lang.String string, T node, java.util.Set<T> visitedNodes)`

## Methods

- `GuiScreen createGui()`
- `<T> ModSortingException.SortingExceptionData<T> getExceptionData()`
- `protected void printStackTrace(EnhancedRuntimeException.WrappedPrintStream stream)`
