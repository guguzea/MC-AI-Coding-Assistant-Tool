# BlockEvent.MultiPlaceEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.PlaceEvent → net.minecraftforge.event.world.BlockEvent.MultiPlaceEvent

## Class signature

```java
public static class BlockEvent.MultiPlaceEvent extends BlockEvent.PlaceEvent
```

## Constructors

- `@Deprecated MultiPlaceEvent(java.util.List<BlockSnapshot> blockSnapshots, IBlockState placedAgainst, EntityPlayer player)`
- `MultiPlaceEvent(java.util.List<BlockSnapshot> blockSnapshots, IBlockState placedAgainst, EntityPlayer player, EnumHand hand)`

## Methods

- `java.util.List<BlockSnapshot> getReplacedBlockSnapshots()` — Gets a list of BlockSnapshots for all blocks which were replaced by the placement of the new blocks.