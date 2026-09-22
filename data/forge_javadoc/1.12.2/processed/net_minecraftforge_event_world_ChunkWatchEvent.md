# ChunkWatchEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.world.ChunkWatchEvent

## Class signature

```java
public class ChunkWatchEvent extends Event
```

## Constructors

- `ChunkWatchEvent(Chunk chunk, EntityPlayerMP player)`
- `@Deprecated ChunkWatchEvent(ChunkPos chunk, EntityPlayerMP player)`

## Methods

- `@Deprecated ChunkPos getChunk()`
- `Chunk getChunkInstance()` — The affected chunk.
- `EntityPlayerMP getPlayer()`