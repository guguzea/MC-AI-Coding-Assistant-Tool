---
title: "FMLConstructionEvent"
description: "public class FMLConstructionEvent extends FMLStateEvent"
package: "net/minecraftforge/fml/common/event"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/event/FMLConstructionEvent.html"
sourceType: javadoc
---

# FMLConstructionEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLEvent → net.minecraftforge.fml.common.event.FMLStateEvent → net.minecraftforge.fml.common.event.FMLConstructionEvent

## Class signature

```java
public class FMLConstructionEvent extends FMLStateEvent
```

## Constructors

- `FMLConstructionEvent(java.lang.Object... eventData)`

## Methods

- `ASMDataTable getASMHarvestedData()`
- `ModClassLoader getModClassLoader()`
- `LoaderState.ModState getModState()` — The current state of the mod
- `com.google.common.collect.ListMultimap<java.lang.String, java.lang.String> getReverseDependencies()`
