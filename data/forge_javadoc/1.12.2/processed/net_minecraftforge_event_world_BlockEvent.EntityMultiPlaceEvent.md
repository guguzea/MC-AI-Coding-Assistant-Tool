# BlockEvent.EntityMultiPlaceEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.EntityPlaceEvent → net.minecraftforge.event.world.BlockEvent.EntityMultiPlaceEvent

## Class signature

```java
public static class BlockEvent.EntityMultiPlaceEvent extends BlockEvent.EntityPlaceEvent
```

## Constructors

- `EntityMultiPlaceEvent(java.util.List<BlockSnapshot> blockSnapshots, IBlockState placedAgainst, Entity entity)`

## Methods

- `java.util.List<BlockSnapshot> getReplacedBlockSnapshots()` — Gets a list of BlockSnapshots for all blocks which were replaced by the placement of the new blocks.