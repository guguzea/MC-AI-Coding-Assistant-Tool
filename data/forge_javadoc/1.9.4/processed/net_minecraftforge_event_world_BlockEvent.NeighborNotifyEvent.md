# BlockEvent.NeighborNotifyEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.NeighborNotifyEvent

## Class signature

```java
public static class BlockEvent.NeighborNotifyEvent extends BlockEvent
```

## Constructors

- `NeighborNotifyEvent(World world, BlockPos pos, IBlockState state, java.util.EnumSet<EnumFacing> notifiedSides)`

## Methods

- `java.util.EnumSet<EnumFacing> getNotifiedSides()` — Gets a list of directions from the base block that updates will occur upon.