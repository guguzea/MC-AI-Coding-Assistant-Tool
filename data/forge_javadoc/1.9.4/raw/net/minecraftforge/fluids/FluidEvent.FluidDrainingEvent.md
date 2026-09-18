---
title: "FluidEvent.FluidDrainingEvent"
description: "Mods should fire this event when a fluid is IFluidTank.drain(int, boolean) from their tank."
package: "net/minecraftforge/fluids"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fluids/FluidEvent.FluidDrainingEvent.html"
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
