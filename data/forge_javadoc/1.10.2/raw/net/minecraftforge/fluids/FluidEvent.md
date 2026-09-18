---
title: "FluidEvent"
description: "Mods should fire this event when a fluid is IFluidTank.drain(int, boolean) from their tank."
package: "net/minecraftforge/fluids"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/FluidEvent.html"
sourceType: javadoc
---

# FluidEvent

## Class signature

```java
public class FluidEvent extends Event
```

## Constructors

- `public FluidEvent( FluidStack fluid, World world, BlockPos pos)`

## Methods

- `public FluidStack getFluid()`
- `public World getWorld()`
- `public BlockPos getPos()`
- `public static final void fireEvent( FluidEvent event)`

## Description

Mods should fire this event when a fluid is IFluidTank.drain(int, boolean) from their tank.
