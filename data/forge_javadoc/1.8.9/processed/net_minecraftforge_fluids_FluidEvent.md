# FluidEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.fluids.FluidEvent

## Class signature

```java
public class FluidEvent extends Event
```

## Constructors

- `FluidEvent(FluidStack fluid, World world, BlockPos pos)`

## Methods

- `static void fireEvent(FluidEvent event)` — A handy shortcut for firing the various fluid events.

## Fields

- `FluidStack fluid`
- `BlockPos pos`
- `World world`