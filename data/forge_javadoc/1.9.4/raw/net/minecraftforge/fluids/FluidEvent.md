---
title: "FluidEvent"
description: "public class FluidEvent extends Event"
package: "net/minecraftforge/fluids"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fluids/FluidEvent.html"
sourceType: javadoc
---

# FluidEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.fluids.FluidEvent

## Class signature

```java
public class FluidEvent extends Event
```

## Constructors

- `FluidEvent(FluidStack fluid, World world, BlockPos pos)`

## Methods

- `static void fireEvent(FluidEvent event)` — A handy shortcut for firing the various fluid events.
- `FluidStack getFluid()`
- `BlockPos getPos()`
- `World getWorld()`
