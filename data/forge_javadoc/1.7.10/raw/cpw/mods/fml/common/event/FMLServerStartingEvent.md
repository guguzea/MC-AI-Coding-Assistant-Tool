---
title: "FMLServerStartingEvent"
description: "public class FMLServerStartingEvent extends FMLStateEvent"
package: "cpw/mods/fml/common/event"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/event/FMLServerStartingEvent.html"
sourceType: javadoc
---

# FMLServerStartingEvent

**Inheritance:** java.lang.Object → cpw.mods.fml.common.event.FMLEvent → cpw.mods.fml.common.event.FMLStateEvent → cpw.mods.fml.common.event.FMLServerStartingEvent

## Class signature

```java
public class FMLServerStartingEvent extends FMLStateEvent
```

## Constructors

- `FMLServerStartingEvent(java.lang.Object... data)`

## Methods

- `LoaderState.ModState getModState()`
- `MinecraftServer getServer()`
- `void registerServerCommand(ICommand command)`
