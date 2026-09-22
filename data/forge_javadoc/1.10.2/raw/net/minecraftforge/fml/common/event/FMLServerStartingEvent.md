---
title: "FMLServerStartingEvent"
description: "public class FMLServerStartingEvent extends FMLStateEvent"
package: "net/minecraftforge/fml/common/event"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/event/FMLServerStartingEvent.html"
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
