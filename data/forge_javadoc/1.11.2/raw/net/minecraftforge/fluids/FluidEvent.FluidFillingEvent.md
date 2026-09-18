---
title: "FluidEvent.FluidFillingEvent"
description: "Mods should fire this event when a fluid is IFluidTank.fill(FluidStack, boolean) their tank implementation. FluidTank does."
package: "net/minecraftforge/fluids"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/FluidEvent.FluidFillingEvent.html"
sourceType: javadoc
---

# FluidEvent.FluidFillingEvent

## Constructors

- `public FluidFillingEvent( FluidStack fluid, World world, BlockPos pos, IFluidTank tank, int amount)`

## Methods

- `public IFluidTank getTank()`
- `public int getAmount()`

## Description

Mods should fire this event when a fluid is IFluidTank.fill(FluidStack, boolean) their tank implementation. FluidTank does.
