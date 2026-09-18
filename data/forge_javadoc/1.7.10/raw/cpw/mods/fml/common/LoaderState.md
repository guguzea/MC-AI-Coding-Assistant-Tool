---
title: "LoaderState"
description: "The state enum used to help track state progression for the loader"
package: "cpw/mods/fml/common"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/LoaderState.html"
sourceType: javadoc
---

# LoaderState

## Class signature

```java
public enum LoaderState extends java.lang.Enum< LoaderState >
```

## Methods

- `public static LoaderState [] values()`
- `public static LoaderState valueOf(java.lang.String name)`
- `public LoaderState transition(boolean errored)`
- `public boolean hasEvent()`
- `public FMLStateEvent getEvent(java.lang.Object... eventData)`
- `public LoaderState requiredState()`

## Description

The state enum used to help track state progression for the loader
