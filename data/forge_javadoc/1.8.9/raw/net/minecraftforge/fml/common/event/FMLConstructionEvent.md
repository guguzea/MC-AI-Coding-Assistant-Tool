---
title: "FMLConstructionEvent"
description: "An internal FML event used to signal the construction of mods. Should not be used by mods."
package: "net/minecraftforge/fml/common/event"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/event/FMLConstructionEvent.html"
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
- `public <any> getReverseDependencies()`

## Description

An internal FML event used to signal the construction of mods. Should not be used by mods.
