# ChunkWatchEvent

## Class signature

```java
public class ChunkWatchEvent extends Event
```

## Constructors

- `public ChunkWatchEvent( Chunk chunk, EntityPlayerMP player)`

## Methods

- `@Deprecated public ChunkWatchEvent( ChunkPos chunk, EntityPlayerMP player)`
- `@Deprecated public ChunkPos getChunk()`
- `public EntityPlayerMP getPlayer()`
- `public Chunk getChunkInstance()`

## Description

ChunkWatchEvent is fired when an event involving a chunk being watched occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. chunk contains