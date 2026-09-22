---
title: "FMLStateEvent"
description: "public abstract class FMLStateEvent extends FMLEvent"
package: "net/minecraftforge/fml/common/event"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/event/FMLStateEvent.html"
sourceType: javadoc
---

# FMLStateEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.event.FMLEvent → net.minecraftforge.fml.common.event.FMLStateEvent

## Class signature

```java
public abstract class FMLStateEvent extends FMLEvent
```

## Constructors

- `FMLStateEvent(java.lang.Object... data)`

## Methods

- `abstract LoaderState.ModState getModState()` — The current state of the mod
- `Side getSide()` — The side we're loading on.
