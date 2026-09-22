# BlockEvent.BreakEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.BlockEvent → net.minecraftforge.event.world.BlockEvent.BreakEvent

## Class signature

```java
public static class BlockEvent.BreakEvent extends BlockEvent
```

## Constructors

- `BreakEvent(World world, BlockPos pos, IBlockState state, EntityPlayer player)`

## Methods

- `int getExpToDrop()` — Get the experience dropped by the block after the event has processed
- `EntityPlayer getPlayer()`
- `void setExpToDrop(int exp)` — Set the amount of experience dropped by the block after the event has processed