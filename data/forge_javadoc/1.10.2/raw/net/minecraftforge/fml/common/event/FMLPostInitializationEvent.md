---
title: "FMLPostInitializationEvent"
description: "public class FMLPostInitializationEvent extends FMLStateEvent"
package: "net/minecraftforge/fml/common/event"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/event/FMLPostInitializationEvent.html"
sourceType: javadoc
---

# FMLPostInitializationEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLEvent → net.minecraftforge.fml.common.event.FMLStateEvent → net.minecraftforge.fml.common.event.FMLPostInitializationEvent

## Class signature

```java
public class FMLPostInitializationEvent extends FMLStateEvent
```

## Constructors

- `FMLPostInitializationEvent(java.lang.Object... data)`

## Methods

- `com.google.common.base.Optional<?> buildSoftDependProxy(java.lang.String modId, java.lang.String className, java.lang.Object... arguments)` — Build an object depending on if a specific target mod is loaded or not.
- `LoaderState.ModState getModState()` — The current state of the mod
