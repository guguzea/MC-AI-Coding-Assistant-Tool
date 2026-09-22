# DecorateBiomeEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.terraingen.DecorateBiomeEvent

## Class signature

```java
public class DecorateBiomeEvent extends Event
```

## Constructors

- `@Deprecated DecorateBiomeEvent(World world, java.util.Random rand, BlockPos pos)`
- `DecorateBiomeEvent(World world, java.util.Random rand, ChunkPos chunkPos)`

## Methods

- `ChunkPos getChunkPos()`
- `@Deprecated BlockPos getPos()` — Deprecated. use getChunkPos() or DecorateBiomeEvent.Decorate.getPlacementPos() instead.
- `java.util.Random getRand()`
- `World getWorld()`