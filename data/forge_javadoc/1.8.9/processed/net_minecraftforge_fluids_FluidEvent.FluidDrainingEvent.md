# FluidEvent.FluidDrainingEvent

## Constructors

- `public FluidDrainingEvent( FluidStack fluid, World world, BlockPos pos, IFluidTank tank, int amount)`

## Description

Mods should fire this event when a fluid is IFluidTank.drain(int, boolean) from their tank.