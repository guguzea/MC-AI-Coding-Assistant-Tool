---
title: "FMLConstructionEvent"
description: "An internal FML event used to signal the construction of mods. Should not be used by mods."
package: "net/minecraftforge/fml/common/event"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/event/FMLConstructionEvent.html"
sourceType: javadoc
---

# FMLConstructionEvent

## Class signature

```java
public class FMLConstructionEvent extends FMLStateEvent
```

## Constructors

- `public FMLConstructionEvent(java.lang.Object... eventData)`

## Methods

- `public ModClassLoader getModClassLoader()`
- `public LoaderState.ModState getModState()`
- `public ASMDataTable getASMHarvestedData()`
- `public com.google.common.collect.ListMultimap<java.lang.String,java.lang.String> getReverseDependencies()`

## Description

An internal FML event used to signal the construction of mods. Should not be used by mods.
