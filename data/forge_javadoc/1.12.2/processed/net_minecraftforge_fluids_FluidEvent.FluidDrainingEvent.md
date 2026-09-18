# FluidEvent.FluidDrainingEvent

## Constructors

- `public FluidDrainingEvent( FluidStack fluid, World world, BlockPos pos, IFluidTank tank, int amount)`

## Methods

- `public IFluidTank getTank()`
- `public int getAmount()`

## Description

Mods should fire this event when a fluid is IFluidTank.drain(int, boolean) from their tank.