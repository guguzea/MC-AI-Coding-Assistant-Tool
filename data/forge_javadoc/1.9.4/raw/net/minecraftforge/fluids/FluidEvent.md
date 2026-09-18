---
title: "FluidEvent"
description: "Mods should fire this event when a fluid is IFluidTank.drain(int, boolean) from their tank."
package: "net/minecraftforge/fluids"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fluids/FluidEvent.html"
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
