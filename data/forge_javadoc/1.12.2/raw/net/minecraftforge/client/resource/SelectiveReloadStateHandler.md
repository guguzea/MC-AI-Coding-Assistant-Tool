---
title: "SelectiveReloadStateHandler"
description: "Handles reload parameters for selective loaders."
package: "net/minecraftforge/client/resource"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/resource/SelectiveReloadStateHandler.html"
sourceType: javadoc
---

# SelectiveReloadStateHandler

## Class signature

```java
public enum SelectiveReloadStateHandler extends java.lang.Enum< SelectiveReloadStateHandler >
```

## Methods

- `public static SelectiveReloadStateHandler [] values()`
- `public static SelectiveReloadStateHandler valueOf(java.lang.String name)`
- `public void beginReload(java.util.function.Predicate< IResourceType > resourcePredicate)`
- `public java.util.function.Predicate< IResourceType > get()`
- `public void endReload()`

## Description

Handles reload parameters for selective loaders.
