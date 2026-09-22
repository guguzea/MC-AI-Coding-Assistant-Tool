---
title: "FMLServerStartingEvent"
description: "public class FMLServerStartingEvent extends FMLStateEvent"
package: "net/minecraftforge/fml/common/event"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/event/FMLServerStartingEvent.html"
sourceType: javadoc
---

# FMLServerStartingEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLEvent → net.minecraftforge.fml.common.event.FMLStateEvent → net.minecraftforge.fml.common.event.FMLServerStartingEvent

## Class signature

```java
public class FMLServerStartingEvent extends FMLStateEvent
```

## Constructors

- `FMLServerStartingEvent(java.lang.Object... data)`

## Methods

- `LoaderState.ModState getModState()` — The current state of the mod
- `MinecraftServer getServer()`
- `void registerServerCommand(ICommand command)`
