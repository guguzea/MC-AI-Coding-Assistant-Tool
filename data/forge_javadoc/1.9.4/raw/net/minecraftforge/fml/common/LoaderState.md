---
title: "LoaderState"
description: "The state enum used to help track state progression for the loader"
package: "net/minecraftforge/fml/common"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/LoaderState.html"
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
- `public java.lang.String getPrettyName()`

## Description

The state enum used to help track state progression for the loader
