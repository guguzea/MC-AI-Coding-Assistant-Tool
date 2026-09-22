# BlockEvent.PlaceEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.PlaceEvent

## Class signature

```java
public static class BlockEvent.PlaceEvent extends BlockEvent
```

## Constructors

- `PlaceEvent(BlockSnapshot blockSnapshot, IBlockState placedAgainst, EntityPlayer player)`

## Methods

- `BlockSnapshot getBlockSnapshot()`
- `ItemStack getItemInHand()`
- `IBlockState getPlacedAgainst()`
- `IBlockState getPlacedBlock()`
- `EntityPlayer getPlayer()`