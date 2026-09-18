---
title: "ModSortingException"
description: "public class ModSortingException extends EnhancedRuntimeException implements IDisplayableError"
package: "net/minecraftforge/fml/common/toposort"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/toposort/ModSortingException.html"
sourceType: javadoc
---

# ModSortingException

## Class signature

```java
public class ModSortingException extends EnhancedRuntimeException implements IDisplayableError
```

## Constructors

- `public ModSortingException(java.lang.String string, T node, java.util.Set<T> visitedNodes)`

## Methods

- `public <T> ModSortingException.SortingExceptionData <T> getExceptionData()`
- `protected void printStackTrace( EnhancedRuntimeException.WrappedPrintStream stream)`
- `public GuiScreen createGui()`
