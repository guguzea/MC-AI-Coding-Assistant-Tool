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