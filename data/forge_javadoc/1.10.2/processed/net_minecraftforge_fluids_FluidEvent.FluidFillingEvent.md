# FluidEvent.FluidFillingEvent

## Constructors

- `public FluidFillingEvent( FluidStack fluid, World world, BlockPos pos, IFluidTank tank, int amount)`

## Methods

- `public IFluidTank getTank()`
- `public int getAmount()`

## Description

Mods should fire this event when a fluid is IFluidTank.fill(FluidStack, boolean) their tank implementation. FluidTank does.