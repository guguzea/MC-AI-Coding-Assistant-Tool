---
title: "FluidEvent.FluidDrainingEvent"
description: "Mods should fire this event when a fluid is IFluidTank.drain(int, boolean) from their tank."
package: "net/minecraftforge/fluids"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/FluidEvent.FluidDrainingEvent.html"
sourceType: javadoc
---

# FluidEvent.FluidDrainingEvent

## Constructors

- `public FluidDrainingEvent( FluidStack fluid, World world, BlockPos pos, IFluidTank tank, int amount)`

## Methods

- `public IFluidTank getTank()`
- `public int getAmount()`

## Description

Mods should fire this event when a fluid is IFluidTank.drain(int, boolean) from their tank.
