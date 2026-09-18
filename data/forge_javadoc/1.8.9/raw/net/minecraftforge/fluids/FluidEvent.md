---
title: "FluidEvent"
description: "Mods should fire this event when a fluid is IFluidTank.drain(int, boolean) from their tank."
package: "net/minecraftforge/fluids"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fluids/FluidEvent.html"
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

- `public static final void fireEvent( FluidEvent event)`

## Description

Mods should fire this event when a fluid is IFluidTank.drain(int, boolean) from their tank.
