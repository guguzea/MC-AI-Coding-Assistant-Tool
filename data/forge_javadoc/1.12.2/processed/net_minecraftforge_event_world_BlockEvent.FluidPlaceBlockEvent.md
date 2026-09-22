# BlockEvent.FluidPlaceBlockEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.FluidPlaceBlockEvent

## Class signature

```java
public static class BlockEvent.FluidPlaceBlockEvent extends BlockEvent
```

## Constructors

- `FluidPlaceBlockEvent(World world, BlockPos pos, BlockPos liquidPos, IBlockState state)`

## Methods

- `BlockPos getLiquidPos()`
- `IBlockState getNewState()`
- `IBlockState getOriginalState()`
- `void setNewState(IBlockState state)`