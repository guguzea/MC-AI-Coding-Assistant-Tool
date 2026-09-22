# BlockEvent.EntityPlaceEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.EntityPlaceEvent

## Class signature

```java
public static class BlockEvent.EntityPlaceEvent extends BlockEvent
```

## Constructors

- `EntityPlaceEvent(BlockSnapshot blockSnapshot, IBlockState placedAgainst, Entity entity)`

## Methods

- `BlockSnapshot getBlockSnapshot()`
- `Entity getEntity()`
- `IBlockState getPlacedAgainst()`
- `IBlockState getPlacedBlock()`